# ARCHITECTURE.md

> Documents every subsystem, its responsibilities, interfaces, and the reasoning
> behind design choices. Update whenever a subsystem's design changes.

## Guiding Principles

- **Event-driven, not call-driven**: subsystems do not call each other
  directly. Every significant occurrence is emitted as a typed event on a
  central Event Bus; subsystems subscribe to what they care about. See
  "The Event Bus" below — this is the primary structural decision in the
  system (2026-08-02 in DECISIONS.md).
- **Everything is a plugin**: attack modules, and eventually the Explorer,
  Recon, Auth, API, and Reporting subsystems themselves, are plugins behind
  one narrow interface. The core engine discovers and wires up plugins; it
  never hardcodes a specific plugin's logic. See "The Plugin System" below.
- **Everything is scoped**: no plugin executes an action against a target
  without first consulting the Authorization & Scope Gate.
- **Everything is logged**: every event that flows through the bus is
  durably persisted by the Memory System, keyed by run ID, for
  reproducibility and audit — this is a natural consequence of being
  event-driven, not a bolted-on feature.

---

## System Diagram (textual)

```
                        ┌───────────────────────────┐
                        │  Authorization & Scope Gate │  ← hard veto on all
                        └──────────────┬─────────────┘    outbound actions,
                                       │                    consulted by every
                                       │                    plugin before acting
                                       ▼
                        ┌───────────────────────────────┐
                        │           EVENT BUS              │  ← all inter-plugin
                        │   (typed, async publish/subscribe) │   communication
                        └───────────────┬───────────────┘
                                       │
     publishes events            subscribes to events           subscribes
            │                            │                            │
  ┌─────────▼─────────┐       ┌──────────▼──────────┐      ┌──────────▼──────────┐
  │  Perception Plugins  │       │   Modeling Plugins    │      │  Attack Plugins       │
  │  Browser Agent        │       │   Knowledge Graph      │      │  Auth Testing          │
  │  API Agent             │       │   Memory System         │      │  AuthZ / IDOR           │
  │  Recon Engine           │       │                          │      │  File Upload            │
  └─────────┬─────────┘       └──────────┬──────────┘      │  ... (registry)         │
            │  emits: PageVisited,        │  emits: NodeAdded,   └──────────┬──────────┘
            │  FormDetected, APIDiscovered│  EdgeAdded, RoleSeen             │ emits: AttackAttempted,
            │  CookieUpdated, JWTCaptured │                                   │ FindingGenerated
            └──────────────┬──────────────┴───────────────────┬───────────────┘
                           ▼                                  ▼
                ┌───────────────────┐               ┌───────────────────┐
                │      Planner        │◄──────────────┤  Reporting Engine   │
                │ (subscribes to graph│  subscribes to │ (subscribes to      │
                │  state, emits        │  findings       │  findings, diffs    │
                │  PlannedAction)       │                 │  vs. prior run)     │
                └───────────────────┘               └───────────────────┘
```

Every plugin box above is registered through the Plugin System and reached
only through the Event Bus — there are no direct import-and-call edges
between them in the diagram, by design.

---

## The Event Bus

**Responsibility**: the single async publish/subscribe backbone all
subsystems communicate through. Defines a growing catalog of typed events
(Pydantic models), e.g.:

- `PageVisited`, `FormDetected`, `ResponseCaptured`, `CookieUpdated`
- `APIDiscovered`, `LoginSucceeded`, `LoginFailed`, `JWTCaptured`
- `NodeAdded` / `EdgeAdded` (Knowledge Graph mutations)
- `PlannedActionProposed`, `AttackAttempted`, `FindingGenerated`

Publishers don't know or care who's listening. Subscribers register
interest in specific event types at plugin `initialize()` time. This is
what lets the Knowledge Graph, Reporter, Planner, and every future attack
module observe the same stream of ground truth without the producer
(Browser Agent, API Agent, etc.) knowing they exist.

**Why it exists**: without it, every new subsystem would require modifying
existing subsystems to call into it (see the rejected direct-call sketch in
DECISIONS.md). With it, the *only* thing a new plugin needs to do is
subscribe to the events it cares about and emit the events it produces.

**Persistence**: every event published to the bus is durably written by the
Memory System subscriber before/as it's delivered to other subscribers —
this is what gives us the complete, replayable action trace required by
THREAT_MODEL.md, essentially for free.

## The Plugin System

**Responsibility**: defines the one interface every capability in the
system implements, and discovers/registers plugins at startup.

```python
class Plugin(Protocol):
    name: str

    async def initialize(self, ctx: PluginContext) -> None: ...
    async def handle_event(self, event: Event) -> None: ...
    async def shutdown(self) -> None: ...
```

`PluginContext` is how a plugin gets everything it's allowed to have: a
handle to publish events on the bus, a *scoped* capability handle for
acting on the target (issuing HTTP requests, driving the browser) which
internally routes every call through the Authorization & Scope Gate, and
read access to the Knowledge Graph for planning purposes. Plugins never get
a raw, unscoped HTTP client or browser handle — the scoping is structural,
not a convention plugins have to remember to follow.

**Both perception and offense are plugins.** The Browser Agent, API Agent,
and Recon Engine are plugins in exactly the same sense that the IDOR or XSS
attack modules are — same interface, same discovery mechanism. This keeps
the core engine to essentially: bus + plugin loader + scope gate + a small
run-orchestration loop. Every subsystem listed below is describable purely
as "a plugin that emits these events and consumes those events" — see
COMPONENTS.md for the per-plugin breakdown (purpose, inputs, outputs,
events emitted/consumed, dependencies).

**Why it exists**: so that adding a new attack class, swapping the
Explorer's strategy, or adding a new report format never requires touching
core engine code (2026-08-02 decision in DECISIONS.md).

---

## Subsystems

### Authorization & Scope Gate

**Responsibility**: the single choke point every outbound request/action must
pass through. Holds the current run's authorized scope (domains, IP ranges,
paths, rate limits, allowed attack classes) and refuses anything outside it.

**Why it exists**: this is a security product; the single highest-severity
failure mode is "tested something it wasn't authorized to test." This
component exists so that property is enforced structurally, not just by
policy/documentation.

**Interface**: `is_allowed(action: PlannedAction) -> AuthorizationResult`.
Plugins never call this directly — they act through the scoped capability
handle provided in their `PluginContext` (see "The Plugin System" above),
and *that* handle calls the Gate before every outbound request/browser
action. This means scope enforcement can't be forgotten by a plugin author;
it's not reachable to bypass without going around the capability handle
entirely, which is itself something code review / future sandboxing should
watch for.

### Browser Agent

**Responsibility**: drives a real browser (headless or headed) to interact
with the target's UI — navigate, fill forms, click, handle multi-step flows
(registration, login, MFA where testable), and capture DOM/network state.

**Why a browser and not just HTTP**: modern SPA/JS-heavy apps hide
significant behavior (client-side routing, dynamically generated forms,
token handling) that a raw HTTP client would miss during discovery.

### API Agent

**Responsibility**: direct HTTP(S)/GraphQL client for interacting with APIs
discovered either via the Browser Agent's network capture or via recon
(OpenAPI/Swagger docs, GraphQL introspection where enabled). Used both for
exploration and for replaying/mutating requests during testing phases.

### Recon Engine

**Responsibility**: light, passive-first information gathering about the
target within scope — technology fingerprinting, exposed API schemas,
robots.txt/sitemap, subdomains *within the authorized scope only*. Feeds
initial seeds to the Browser/API Agents; does not itself perform intrusive
testing.

### Authentication Engine

**Responsibility**: manages credentials/sessions for the run — registers or
logs in as one or more test personas, tracks session tokens/cookies, detects
session expiry and re-authenticates. Later: tests the authentication
mechanism itself (credential handling, lockout behavior, MFA flow, password
reset flow) as an Attack Module, distinct from its role as infrastructure
for every other module.

### Authorization Testing Module (Attack Module)

**Responsibility**: tests access-control boundaries — IDOR/BOLA (accessing
other users'/tenants' resources), vertical privilege escalation (low-priv
role reaching high-priv functionality), horizontal privilege escalation.
Relies on the Knowledge Graph having captured multiple roles/personas and
resource ID patterns.

### File Upload Testing Module (Attack Module)

**Responsibility**: tests file upload endpoints for missing type/content
validation, path traversal in filenames, stored-content risks. Operates only
against upload endpoints discovered and in-scope.

### Knowledge Graph

**Responsibility**: the persistent structural model of the target — nodes for
pages, forms, API endpoints, roles/personas, resources/IDs; edges for
navigation, form-submission-leads-to-state, auth-boundary crossings. This is
what distinguishes the system from a stateless scanner: the Planner reasons
over this graph, not over raw traffic.

**Design note**: needs both graph-query capability (path finding, "what
states are reachable from role X") and simple structured lookup (find all
forms with a file upload field). Candidate: a graph DB (e.g., Neo4j) or a
relational store with an in-memory graph layer for query performance —
decision pending, record in DECISIONS.md.

### Memory System

**Responsibility**: durable, append-only record of every observation
(HTTP request/response pairs, DOM snapshots, screenshots, console logs) and
every action taken, keyed by run ID and timestamp. This is the raw
evidence layer beneath the Knowledge Graph (which is the *interpreted*
layer) and beneath the Reporting Engine (which cites evidence from here).

### Planner

**Responsibility**: the reasoning core. Consumes the current Knowledge Graph
state plus the catalog of available Attack Modules, and proposes the next
action(s) — which module to run against which target, and why. LLM-driven
rather than a static rule table, so it can reason about app-specific logic
(e.g., "this app has a multi-tenant resource pattern, prioritize IDOR
testing on endpoints with numeric/sequential IDs").

**Constraint**: the Planner proposes; the Scope Gate disposes. The Planner
never has authority to bypass scope.

### Plugin System / Attack Module Registry

**Responsibility**: defines the interface every Attack Module implements
(`plan() -> list[PlannedAction]`, `execute(action) -> Finding | None`) and
handles discovery/registration of modules. New attack classes are added by
implementing this interface, not by modifying the core engine.

### Reporting Engine

**Responsibility**: converts Findings (with linked evidence from the Memory
System) into developer-facing reports — severity, repro steps, evidence,
suggested remediation. Also diffs findings against the previous run on the
same target to flag regressions (previously-fixed issue reappeared) and new
issues introduced since the last deploy.

---

## Cross-Cutting Concerns

- **Idempotency & safety**: Attack Modules that could have destructive
  side effects (e.g., data-modifying requests) must be explicitly flagged
  and require an explicit run-level flag to enable; default run mode is
  read/detect-oriented.
- **Rate limiting**: all outbound traffic respects a configurable
  requests-per-second ceiling to avoid degrading the target's availability —
  this is an availability-preserving requirement, not just politeness.
- **Observability**: structured logging throughout; every run produces a
  complete, replayable action trace.
