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

**Verified** (this session): `pytest` (35/35 passing) and the CLI have now
actually been run, not just syntax-checked. One bug surfaced by that
verification is fixed — see "Known Bugs" below.

## Current Task

None in progress. Next session continues down the remaining Phase 0 list
(steps 4, 8, 9).

## Known Bugs

- [x] **Fixed**: `cli.py` — with only one `@app.command()` registered and
  no `@app.callback()`, Typer collapsed the app into a bare single command,
  so the documented invocation (`aipentester init-run --domain ...`)
  actually failed with "Got unexpected extra argument(s) (init-run)"; the
  subcommand name was silently dropped. Fixed by adding an empty
  `@app.callback()`, which forces Typer to keep treating the app as a
  command group. Confirmed both `aipentester init-run --domain ...`
  (works) and bare `aipentester --domain ...` (now correctly rejected,
  since `init-run` is required) behave as documented in README.md.
  This will keep working as-is once Phase 1 adds more commands.

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
