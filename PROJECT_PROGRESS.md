# PROJECT_PROGRESS.md

> Read this + MASTER_PLAN.md to resume work immediately. Update after every
> meaningful session.

## Current Milestone

Phase 0 — Foundations. Steps 1–3 and 5–7 of the ordered Phase 0 list in
ROADMAP.md are done; steps 4, 8, 9 remain.

## Completed Tasks

- [x] MASTER_PLAN.md, ARCHITECTURE.md, ROADMAP.md, DECISIONS.md,
      THREAT_MODEL.md, COMPONENTS.md written — full planning doc set.
- [x] **Stack finalized** (Python 3.13 / uv / Playwright / LiteLLM / httpx /
      Typer / Pydantic v2 / pytest / structlog / SQLite) — DECISIONS.md.
- [x] **Event Bus designed and implemented** (`core/bus.py`, `core/events.py`)
      — async pub/sub, wildcard subscribers, handler isolation (a raising
      handler doesn't block delivery to others), in-memory history + replay.
- [x] **Plugin System designed and implemented** (`core/plugin.py`,
      `core/loader.py`) — `Plugin` protocol, `PluginContext`,
      `ScopedCapability` (structural scope enforcement — a plugin cannot act
      on a target without going through the Gate), `PluginRegistry` lifecycle.
- [x] **Scope configuration designed** (`core/scope_config.py`) —
      `ScopeConfig`: allowed domains/paths, allowed attack classes,
      destructive-mode opt-in, rate limit, authorization attestation.
      Wildcard domains rejected at construction time.
- [x] **Repository scaffolded** — `uv`-based `pyproject.toml`, package
      layout (`core/`, `plugins/`, `storage/`), README.
- [x] **Authorization & Scope Gate implemented** (`core/scope.py`) —
      domain/path/attack-class enforcement, `ScopeViolation` exception,
      non-raising `check()` for planning-time use.
- [x] **Memory System implemented** (`core/memory.py`) — wildcard bus
      subscriber, durably persists every event via `EventRepository`.
- [x] **Storage layer** (`storage/repository.py`) — `EventRepository`
      interface + `SQLiteEventRepository` implementation, so a future
      Postgres swap doesn't touch callers.
- [x] **Run orchestration** (`core/run.py`) + CLI skeleton (`cli.py`) wiring
      bus + gate + registry + memory together end-to-end.
- [x] **Tests written**: `test_bus.py`, `test_scope.py`, `test_plugin.py`,
      `test_loader.py`, `test_memory.py`, `test_run_integration.py` — covers
      the Event Bus, Scope Gate, Plugin System, Memory System individually
      and the full Phase 0 core wired together end-to-end (a stand-in
      perception plugin proves an out-of-scope action is genuinely denied
      and an in-scope event is genuinely persisted).

**Not yet verified**: the sandbox this was built in has no network access,
so `uv sync` / `pytest` have not actually been run. Every file was
syntax-checked (`py_compile`), and the logic was written and reviewed
carefully, but **run `uv sync --all-extras && uv run pytest` as the very
first step of the next session** before writing new code, to confirm
everything actually passes and to catch anything the syntax check couldn't.

## Current Task

None in progress. Next session starts with the verification step above,
then continues down the remaining Phase 0 list.

## Known Bugs

None known — but see "Not yet verified" above; this is the first thing to
confirm, not an assumption to carry forward.

## Blockers

None. The two blockers from the previous session (stack choice, scope
config format) are resolved.

## Next Priorities

1. **Run the test suite for real** (`uv sync --all-extras && uv run
   pytest`) — first thing, before anything else.
2. **Scope config format (step 4)**: the schema exists (`ScopeConfig`) and
   is tested, but hasn't been validated against a real Phase-0-exit-criteria
   scenario end-to-end via the CLI beyond the empty-run smoke test. Consider
   whether `allowed_domains` needs multi-domain CLI support before Phase 1.
3. **Local practice targets (step 8)**: stand up OWASP Juice Shop, DVWA,
   WebGoat via Docker — needed before any perception plugin work in Phase 1
   can be meaningfully tested against something real.
4. **Structured logging (step 9)**: wire `structlog` through
   Event Bus → Memory System path (currently uses stdlib `logging` in
   `loader.py`/`bus.py` — swap once structlog conventions are decided).
5. Only after 1–4: begin Phase 1 (Browser Agent, API Agent, session
   handling) per ROADMAP.md.

## Estimated Completion

Not estimated — no velocity data yet (this is the first coding session).
Revisit once Phase 0 fully closes out.
