from __future__ import annotations

import pytest

from aipentester.core.bus import EventBus
from aipentester.core.events import Event, PageVisited
from aipentester.core.plugin import Plugin, PluginContext
from aipentester.core.scope import ScopeGate, ScopeViolation
from aipentester.core.scope_config import ScopeConfig


def make_gate(**overrides: object) -> ScopeGate:
    defaults: dict[object, object] = {
        "run_id": "run-1",
        "allowed_domains": ["target.example.com"],
        "allowed_attack_classes": [],
        "authorized_by": "test-operator",
    }
    defaults.update(overrides)
    return ScopeGate(ScopeConfig(**defaults))  # type: ignore[arg-type]


class RecordingPlugin:
    """A minimal plugin used to prove the `Plugin` protocol is satisfiable
    and that PluginContext wiring (publish/subscribe) works end-to-end.
    """

    name = "recording_plugin"

    def __init__(self) -> None:
        self.received: list[Event] = []
        self.initialized = False
        self.shut_down = False

    async def initialize(self, ctx: PluginContext) -> None:
        ctx.subscribe(PageVisited, self.handle_event)
        self.initialized = True

    async def handle_event(self, event: Event) -> None:
        self.received.append(event)

    async def shutdown(self) -> None:
        self.shut_down = True


@pytest.mark.asyncio
async def test_recording_plugin_satisfies_the_plugin_protocol() -> None:
    plugin = RecordingPlugin()
    assert isinstance(plugin, Plugin)


@pytest.mark.asyncio
async def test_plugin_context_subscribe_wires_up_bus_delivery() -> None:
    bus = EventBus()
    gate = make_gate()
    plugin = RecordingPlugin()
    ctx = PluginContext(run_id="run-1", bus=bus, gate=gate, plugin_name=plugin.name)

    await plugin.initialize(ctx)
    event = PageVisited(
        run_id="run-1", source_plugin="other", url="https://target.example.com/", status_code=200
    )
    await bus.publish(event)

    assert plugin.received == [event]


@pytest.mark.asyncio
async def test_plugin_context_publish_reaches_other_subscribers() -> None:
    bus = EventBus()
    gate = make_gate()
    received: list[Event] = []

    async def other_handler(event: Event) -> None:
        received.append(event)

    bus.subscribe(PageVisited, other_handler)

    ctx = PluginContext(run_id="run-1", bus=bus, gate=gate, plugin_name="publisher")
    event = PageVisited(
        run_id="run-1", source_plugin="publisher", url="https://target.example.com/", status_code=200
    )
    await ctx.publish(event)

    assert received == [event]


@pytest.mark.asyncio
async def test_scoped_capability_request_is_denied_outside_scope() -> None:
    bus = EventBus()
    gate = make_gate()
    ctx = PluginContext(run_id="run-1", bus=bus, gate=gate, plugin_name="attacker_plugin")

    with pytest.raises(ScopeViolation):
        await ctx.capability.request("GET", "https://evil.example.com/")


@pytest.mark.asyncio
async def test_scoped_capability_navigate_is_denied_outside_scope() -> None:
    bus = EventBus()
    gate = make_gate()
    ctx = PluginContext(run_id="run-1", bus=bus, gate=gate, plugin_name="browser_plugin")

    with pytest.raises(ScopeViolation):
        await ctx.capability.navigate("https://evil.example.com/")


@pytest.mark.asyncio
async def test_scoped_capability_request_passes_scope_check_before_not_implemented() -> None:
    # Phase 0: request() has no HTTP execution wired in yet (that lands with
    # the API Agent plugin in Phase 1). What we're proving here is that the
    # scope check happens FIRST and unconditionally -- an in-scope request
    # reaches the "not implemented" stub, not a silent no-op or a bypass.
    bus = EventBus()
    gate = make_gate()
    ctx = PluginContext(run_id="run-1", bus=bus, gate=gate, plugin_name="api_agent")

    with pytest.raises(NotImplementedError):
        await ctx.capability.request("GET", "https://target.example.com/")
