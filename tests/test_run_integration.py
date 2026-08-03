"""End-to-end proof that the Phase 0 core -- Event Bus, Plugin System,
Scope Gate, Memory System, wired together via Run -- works as a whole, not
just as isolated units. This is the test that should fail loudly if a
future refactor breaks the wiring between these four pieces.
"""

from __future__ import annotations

import json

import pytest

from aipentester.core.events import Event, PageVisited
from aipentester.core.plugin import PluginContext
from aipentester.core.run import Run
from aipentester.core.scope import ScopeViolation
from aipentester.core.scope_config import ScopeConfig
from aipentester.storage.repository import SQLiteEventRepository


class SimplePerceptionPlugin:
    """Stands in for a future Browser/API Agent plugin: publishes one
    PageVisited event for an in-scope URL and attempts one out-of-scope
    action, which must be denied by the Gate.
    """

    name = "simple_perception"

    def __init__(self, in_scope_url: str, out_of_scope_url: str) -> None:
        self._in_scope_url = in_scope_url
        self._out_of_scope_url = out_of_scope_url
        self.denied = False

    async def initialize(self, ctx: PluginContext) -> None:
        await ctx.publish(
            PageVisited(
                run_id=ctx.run_id,
                source_plugin=self.name,
                url=self._in_scope_url,
                status_code=200,
                title="Home",
            )
        )
        try:
            await ctx.capability.request("GET", self._out_of_scope_url)
        except ScopeViolation:
            self.denied = True
        except NotImplementedError:
            # in-scope requests raise NotImplementedError in Phase 0 (see
            # ScopedCapability docstring) -- shouldn't happen here since
            # this URL is intentionally out of scope, but don't mask a
            # wiring bug if it does.
            raise

    async def handle_event(self, event: Event) -> None:
        pass

    async def shutdown(self) -> None:
        pass


@pytest.mark.asyncio
async def test_full_run_records_events_and_enforces_scope(tmp_path) -> None:
    config = ScopeConfig(
        run_id="integration-run-1",
        allowed_domains=["target.example.com"],
        authorized_by="test-operator",
    )
    repository = SQLiteEventRepository(tmp_path / "events.db")
    run = Run(config, repository)

    plugin = SimplePerceptionPlugin(
        in_scope_url="https://target.example.com/",
        out_of_scope_url="https://evil.example.com/",
    )
    run.add_plugin(plugin)

    await run.start()
    await run.stop()

    assert plugin.denied is True, "out-of-scope action should have been denied by the Gate"

    events = await run.event_log()
    payloads = [json.loads(e) for e in events]
    page_visits = [p for p in payloads if p.get("url") == "https://target.example.com/"]
    assert len(page_visits) == 1, "the in-scope PageVisited event should be durably persisted"


@pytest.mark.asyncio
async def test_run_with_no_plugins_still_completes_cleanly(tmp_path) -> None:
    config = ScopeConfig(
        run_id="integration-run-2",
        allowed_domains=["target.example.com"],
        authorized_by="test-operator",
    )
    repository = SQLiteEventRepository(tmp_path / "events.db")
    run = Run(config, repository)

    await run.start()
    await run.stop()

    assert await run.event_log() == []
