from __future__ import annotations

import pytest

from aipentester.core.bus import EventBus
from aipentester.core.events import Event, PluginInitialized, PluginShutdown
from aipentester.core.loader import PluginRegistry
from aipentester.core.plugin import PluginContext
from aipentester.core.scope import ScopeGate
from aipentester.core.scope_config import ScopeConfig


def make_gate() -> ScopeGate:
    return ScopeGate(
        ScopeConfig(run_id="run-1", allowed_domains=["target.example.com"], authorized_by="tester")
    )


class LifecyclePlugin:
    name = "lifecycle_plugin"

    def __init__(self) -> None:
        self.initialized_with: PluginContext | None = None
        self.shut_down = False

    async def initialize(self, ctx: PluginContext) -> None:
        self.initialized_with = ctx

    async def handle_event(self, event: Event) -> None:
        pass

    async def shutdown(self) -> None:
        self.shut_down = True


@pytest.mark.asyncio
async def test_register_rejects_duplicate_plugin_names() -> None:
    bus = EventBus()
    registry = PluginRegistry(run_id="run-1", bus=bus, gate=make_gate())
    registry.register(LifecyclePlugin())

    with pytest.raises(ValueError):
        registry.register(LifecyclePlugin())


@pytest.mark.asyncio
async def test_start_all_initializes_every_registered_plugin() -> None:
    bus = EventBus()
    registry = PluginRegistry(run_id="run-1", bus=bus, gate=make_gate())
    plugin = LifecyclePlugin()
    registry.register(plugin)

    await registry.start_all()

    assert plugin.initialized_with is not None
    assert plugin.initialized_with.run_id == "run-1"


@pytest.mark.asyncio
async def test_start_all_publishes_plugin_initialized_event() -> None:
    bus = EventBus()
    registry = PluginRegistry(run_id="run-1", bus=bus, gate=make_gate())
    registry.register(LifecyclePlugin())

    await registry.start_all()

    init_events = [e for e in bus.history() if isinstance(e, PluginInitialized)]
    assert len(init_events) == 1
    assert init_events[0].plugin_name == "lifecycle_plugin"


@pytest.mark.asyncio
async def test_shutdown_all_shuts_down_every_plugin_and_publishes_event() -> None:
    bus = EventBus()
    registry = PluginRegistry(run_id="run-1", bus=bus, gate=make_gate())
    plugin = LifecyclePlugin()
    registry.register(plugin)
    await registry.start_all()

    await registry.shutdown_all()

    assert plugin.shut_down is True
    shutdown_events = [e for e in bus.history() if isinstance(e, PluginShutdown)]
    assert len(shutdown_events) == 1


@pytest.mark.asyncio
async def test_plugins_property_reflects_registration_order() -> None:
    bus = EventBus()
    registry = PluginRegistry(run_id="run-1", bus=bus, gate=make_gate())
    a, b = LifecyclePlugin(), LifecyclePlugin()
    a.name, b.name = "a", "b"
    registry.register(a)
    registry.register(b)

    assert [p.name for p in registry.plugins] == ["a", "b"]
