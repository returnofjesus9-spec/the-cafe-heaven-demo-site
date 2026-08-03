from __future__ import annotations

import json

import pytest

from aipentester.core.bus import EventBus
from aipentester.core.events import FindingGenerated, PageVisited
from aipentester.core.memory import MemorySystem
from aipentester.core.plugin import PluginContext
from aipentester.core.scope import ScopeGate
from aipentester.core.scope_config import ScopeConfig
from aipentester.storage.repository import SQLiteEventRepository


def make_gate() -> ScopeGate:
    return ScopeGate(
        ScopeConfig(run_id="run-1", allowed_domains=["target.example.com"], authorized_by="tester")
    )


@pytest.mark.asyncio
async def test_memory_system_persists_every_event_type(tmp_path) -> None:
    db_path = tmp_path / "events.db"
    repo = SQLiteEventRepository(db_path)
    memory = MemorySystem(repo)
    bus = EventBus()
    ctx = PluginContext(run_id="run-1", bus=bus, gate=make_gate(), plugin_name=memory.name)
    await memory.initialize(ctx)

    page_event = PageVisited(
        run_id="run-1", source_plugin="browser", url="https://target.example.com/", status_code=200
    )
    finding_event = FindingGenerated(
        run_id="run-1",
        source_plugin="xss_module",
        attack_class="xss",
        title="Reflected XSS on search",
        severity="high",
        target_url="https://target.example.com/search",
        description="unsanitized query param reflected in response",
    )
    await bus.publish(page_event)
    await bus.publish(finding_event)

    stored = await memory.events_for_run("run-1")
    assert len(stored) == 2
    payloads = [json.loads(row) for row in stored]
    assert {p["url"] for p in payloads if "url" in p and "status_code" in p} == {
        "https://target.example.com/"
    }
    assert any(p.get("title") == "Reflected XSS on search" for p in payloads)


@pytest.mark.asyncio
async def test_memory_system_only_returns_events_for_the_requested_run(tmp_path) -> None:
    db_path = tmp_path / "events.db"
    repo = SQLiteEventRepository(db_path)
    memory = MemorySystem(repo)
    bus = EventBus()
    ctx = PluginContext(run_id="run-1", bus=bus, gate=make_gate(), plugin_name=memory.name)
    await memory.initialize(ctx)

    await bus.publish(
        PageVisited(
            run_id="run-1", source_plugin="browser", url="https://target.example.com/a", status_code=200
        )
    )
    await bus.publish(
        PageVisited(
            run_id="run-2", source_plugin="browser", url="https://target.example.com/b", status_code=200
        )
    )

    stored = await memory.events_for_run("run-1")
    assert len(stored) == 1
    assert json.loads(stored[0])["url"] == "https://target.example.com/a"


@pytest.mark.asyncio
async def test_sqlite_repository_persists_across_new_connections(tmp_path) -> None:
    db_path = tmp_path / "events.db"
    repo = SQLiteEventRepository(db_path)
    event = PageVisited(
        run_id="run-1", source_plugin="browser", url="https://target.example.com/", status_code=200
    )
    await repo.append(event)

    # A brand-new repository instance pointed at the same path should see
    # the same data -- proves persistence isn't just in-process caching.
    repo2 = SQLiteEventRepository(db_path)
    stored = await repo2.events_for_run("run-1")
    assert len(stored) == 1
