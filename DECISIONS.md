# DECISIONS.md

> Record every significant engineering decision here so future sessions don't
> re-litigate settled questions. Append-only in spirit — if a decision is
> later reversed, add a new entry rather than editing history, and link back
> to the original.

Format for each entry:

```
## YYYY-MM-DD — <short title>

**Decision**: what was decided
**Reason**: why
**Alternatives considered**: what else was on the table
**Trade-offs**: what we're giving up / accepting
```

---

## 2026-08-02 — Adopt authorization-gated architecture as non-negotiable

**Decision**: The Authorization & Scope Gate (see ARCHITECTURE.md) is a hard
architectural dependency — no agent or attack module may issue a request to
a target without passing through it. This is treated as a Phase 0 blocker,
not a Phase 8 nice-to-have.

**Reason**: This is a security product tested against real applications;
the single most damaging failure mode is acting outside authorized scope.
Making this structural (not just a documented policy) means the failure
mode requires an actual engineering bypass, not just an oversight.

**Alternatives considered**: Policy-only enforcement (document the rule,
trust module authors to respect it). Rejected — too easy to violate
accidentally as the module count grows.

**Trade-offs**: Adds friction to every module's development (must always
route through the gate) and requires the config/scope format to be
designed early and well, before it's clear what all future modules will
need. Accepted as worth it.

---

## 2026-08-02 — Development/testing targets restricted to known practice apps

**Decision**: Through at least Phase 0–3, all development and testing of
this system uses deliberately-vulnerable practice applications (OWASP Juice
Shop, DVWA, WebGoat) rather than any production or third-party target.

**Reason**: Keeps development safe and legal by construction while the
Authorization & Scope Gate itself is still being built and hardened — we
don't want the tool's own bootstrapping phase to be the first thing that
tests the scope enforcement.

**Alternatives considered**: Testing against a real staging environment
early. Rejected for the bootstrap phase — no reason to take on that risk
before the Gate exists and is verified.

**Trade-offs**: Practice apps may not surface every real-world edge case
(auth flows, multi-tenant patterns) that production apps will. Will need a
"graduate to a real authorized staging target" checkpoint once Phase 3
exit criteria are met — record that decision here when it happens.

---

---

## 2026-08-02 — Core stack finalized

**Decision**:

- Language: Python 3.13+
- Package manager: `uv`
- Framework: none initially — library-first, compose our own entrypoints
- Browser automation: Playwright
- LLM abstraction: LiteLLM (provider-agnostic — OpenAI, Anthropic, OpenRouter,
  local models)
- HTTP client: httpx
- CLI: Typer
- Validation/schemas: Pydantic v2
- Testing: pytest
- Logging: structlog
- Concurrency: asyncio throughout
- Storage: SQLite initially; storage layer abstracted behind a repository
  interface so PostgreSQL can replace it later without touching callers
- Knowledge graph: not a graph database yet — a graph abstraction (nodes/edges
  as typed records) backed by SQLite tables. Migrate to a real graph DB
  (e.g., Neo4j) only if query patterns actually demand it.

**Reason**: Python has the strongest ecosystem overlap between AppSec
tooling, browser automation (Playwright's Python bindings are first-class),
and LLM integration. `uv` gives fast, reproducible dependency management.
LiteLLM avoids locking the Planner to one model provider — important since
the reasoning core is the part most likely to swap providers as the
landscape changes. SQLite-first avoids standing up infrastructure before
it's needed, while the repository-interface abstraction means the eventual
Postgres migration is a swap, not a rewrite. Same logic applies to the
knowledge graph: a real graph DB is an optimization for a query pattern we
don't have evidence we need yet — start with the simplest thing that can
represent nodes/edges correctly.

**Alternatives considered**: TypeScript/Node (also strong Playwright
support, but weaker AppSec/security-tooling ecosystem and weaker data-science-
style libraries if the Planner ever needs them). A graph DB from day one
(Neo4j) — rejected as premature; SQLite-backed graph abstraction can be
migrated later behind the same interface.

**Trade-offs**: SQLite will need a real migration path designed before
multi-tenant/concurrent-write scenarios arrive (Postgres). LiteLLM adds a
thin abstraction layer we maintain ourselves versus using a provider SDK
directly — accepted, since provider flexibility for the Planner outweighs
that cost.

---

## 2026-08-02 — Adopt an Event Bus as the primary inter-subsystem communication mechanism

**Decision**: Subsystems do not call each other directly. Every significant
occurrence (page navigated, form detected, API discovered, login succeeded,
JWT captured, cookie changed, attack attempted, finding generated, etc.)
is emitted as a typed event on a central async Event Bus. Subsystems
subscribe to the events they care about rather than being called by name.

**Reason**: This is the single highest-leverage architectural decision in
the project. It decouples perception (Browser/API Agents) from modeling
(Knowledge Graph), reasoning (Planner), and output (Reporter) — each can be
built, tested, and extended independently. It also means every future
capability (a new attack module, a new report format, a live dashboard) is
just another subscriber, never a change to an existing producer. It gives
us a complete, replayable event log for free, which directly serves the
Memory System and audit requirements in THREAT_MODEL.md.

**Alternatives considered**: Direct method calls between subsystems
(Browser → Explorer → API Agent, etc., as an initial sketch had it).
Rejected — creates a combinatorial coupling problem as attack modules
multiply; every new module would need to know which upstream subsystems to
call and be called by.

**Trade-offs**: Debugging an event-driven system requires better tooling
(event log inspection, replay) than debugging direct calls — the Memory
System's action-trace requirement (see ARCHITECTURE.md) is treated as
mandatory infrastructure specifically because of this, not optional
tooling. Slight overhead in defining a typed event for everything rather
than passing arguments directly — accepted, the extensibility payoff is
worth it.

---

## 2026-08-02 — Every capability is a plugin behind a common interface

**Decision**: Attack classes, and eventually the Explorer, Recon, Auth, API,
and Reporting subsystems themselves, are implemented as plugins conforming
to a single narrow interface (`initialize`, `handle_event`, `shutdown`,
plus a `name` identifier). The core engine discovers and registers plugins;
it never imports or hardcodes a specific plugin's logic. This decision is
made before implementing the Scope Gate — plugin architecture and event
bus are designed first because every other component, including the Gate's
own integration points, is expressed in terms of them.

**Reason**: Ensures adding a new attack class (or swapping the Explorer's
strategy, or adding a new report format) never requires modifying core
engine code — directly serving the "modular, plugin-based, independently
replaceable" principle in MASTER_PLAN.md and ARCHITECTURE.md. Treating even
the Explorer/Recon/Auth/API subsystems as plugins (not just attack modules)
keeps the core engine genuinely small and keeps the door open to running
individual agents independently later.

**Alternatives considered**: Plugin interface only for attack modules, with
Explorer/Recon/Auth/API as privileged "core" subsystems with direct engine
integration. Rejected — that would mean two different extension models in
the codebase (privileged core subsystems vs. plugins), which is exactly the
kind of inconsistency that becomes expensive at 100k+ lines.

**Trade-offs**: A uniform plugin interface has to be general enough to fit
very different subsystems (a browser-driving Explorer vs. a stateless XSS
payload tester) — the interface is intentionally narrow (init/handle_event/
shutdown) so it doesn't force artificial uniformity beyond event handling.
Plugins that need to *act* on a target (send a request, drive the browser)
do so by requesting the relevant capability through a scoped handle that
itself routes through the Authorization & Scope Gate — see ARCHITECTURE.md.

---

*(Add new entries above this line, most recent last, as decisions are made.)*
