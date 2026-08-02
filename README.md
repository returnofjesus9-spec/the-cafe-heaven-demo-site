# aipentester — Autonomous AI Application Security Engineer

Status: **Phase 0 (Foundations)**. The Event Bus, Plugin System, Memory
System, and Authorization & Scope Gate are implemented and tested. No
perception (Browser/API Agent) or attack plugins exist yet — see
`docs/ROADMAP.md`.

## Start here

Read, in order:

1. `docs/MASTER_PLAN.md` — vision, goals, non-goals, subsystem overview
2. `PROJECT_PROGRESS.md` — what's done, what's next
3. `docs/DECISIONS.md` — why the architecture is shaped the way it is
4. `docs/ARCHITECTURE.md` — the Event Bus / Plugin System / Scope Gate design
5. `docs/COMPONENTS.md` — per-subsystem purpose/inputs/outputs/events reference
6. `docs/ROADMAP.md` — phased milestones
7. `docs/THREAT_MODEL.md` — this is a security product; it must be secure

**This document set is the project's permanent memory.** Every session
should read the above before writing code, and update `PROJECT_PROGRESS.md`
(plus `DECISIONS.md` for any new architectural decision) before ending.

## Setup

```bash
uv sync --all-extras
uv run playwright install chromium   # only needed once perception plugins exist (Phase 1)
```

## Running tests

```bash
uv run pytest
```

The test suite currently covers, in priority order matching
`docs/ROADMAP.md` Phase 0 step 7 ("comprehensive tests" for the load-bearing
core):

- `tests/test_bus.py` — Event Bus publish/subscribe semantics, wildcard
  subscribers, handler isolation, history/replay
- `tests/test_scope.py` — Authorization & Scope Gate: domain/path/attack-class
  enforcement, denial reasons, wildcard-domain rejection at config time
- `tests/test_plugin.py` — the `Plugin` protocol, `PluginContext` wiring, and
  proof that `ScopedCapability` enforces scope *before* any execution path
- `tests/test_loader.py` — Plugin Registry lifecycle (register, start_all,
  shutdown_all) and lifecycle event publication
- `tests/test_memory.py` — Memory System persistence via the SQLite-backed
  `EventRepository`, including cross-connection durability
- `tests/test_run_integration.py` — end-to-end: a stand-in plugin proves
  scope is genuinely enforced and events are genuinely persisted when every
  piece is wired together via `Run`

## Try it

```bash
uv run aipentester init-run --domain target.example.com --authorized-by "your-name"
```

Starts and immediately stops an empty run (no plugins registered yet) to
prove the orchestration wiring works end-to-end. Prints the run id and the
number of durably-recorded events.

## Repository layout

```
src/aipentester/
    core/
        events.py    # typed event catalog
        bus.py        # the Event Bus
        plugin.py      # Plugin protocol + PluginContext + ScopedCapability
        loader.py       # Plugin Registry (discovery/lifecycle)
        scope.py         # Authorization & Scope Gate
        scope_config.py   # ScopeConfig schema (what a run is authorized to do)
        memory.py          # Memory System (durable event persistence)
        run.py              # Run orchestration (wires everything together)
    storage/
        repository.py    # EventRepository interface + SQLite implementation
    plugins/              # empty — Phase 1+ perception/attack plugins land here
    cli.py                 # Typer entrypoint
tests/                      # see "Running tests" above
docs/                         # permanent project memory — read first
```

## Contributing principle

Optimize for a codebase that can still be cleanly understood and extended
after 18 months and 100,000+ lines of code. Favor explicit interfaces, loose
coupling, and architectural clarity over rapid feature development. Every
new capability should be addable as a plugin, without modifying
`core/`. If a change requires touching `core/`, stop and ask whether the
plugin interface is missing something more general, rather than special-
casing it.
