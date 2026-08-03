# COMPONENTS.md

> One entry per plugin/subsystem. As the project grows to dozens of plugins,
> this is the fast-reference doc — what a component does, its contract with
> the rest of the system (events in/out), and what it depends on. Add a new
> entry here whenever a new plugin is added; keep it current when a
> plugin's event contract changes.

Template for each entry:

```
### <Component Name>

- **Purpose**: one or two sentences.
- **Inputs**: what it needs to operate (config, prior state, capability
  handles).
- **Outputs**: what it produces.
- **Events emitted**: typed events this component publishes to the bus.
- **Events consumed**: typed events this component subscribes to.
- **Dependencies**: other components / external services it relies on.
- **Future improvements**: known gaps or planned extensions.
```

---

## Core Engine (not a plugin)

### Event Bus

- **Purpose**: async publish/subscribe backbone; all inter-plugin
  communication flows through it.
- **Inputs**: typed events published by any plugin.
- **Outputs**: delivers events to all subscribed plugins; hands every event
  to the Memory System for durable persistence.
- **Events emitted**: none itself — it's the transport, not a producer.
- **Events consumed**: all (it's the router).
- **Dependencies**: none (foundational).
- **Future improvements**: backpressure handling if a subscriber is slow;
  potential move to a real message broker (e.g., Redis Streams) if
  distributed scanning (Phase 8) requires cross-process delivery.

### Plugin Loader / Registry

- **Purpose**: discovers plugins, constructs their `PluginContext`
  (scoped capability handles, bus handle, graph read-access), calls
  `initialize`/`shutdown` at run boundaries.
- **Inputs**: plugin manifest/entry-point registration.
- **Outputs**: a running set of initialized plugins for a scan run.
- **Events emitted**: `PluginInitialized`, `PluginShutdown` (for
  observability of the run itself).
- **Events consumed**: none.
- **Dependencies**: Authorization & Scope Gate (to construct scoped
  capability handles per plugin).
- **Future improvements**: plugin sandboxing/permission model ahead of the
  plugin marketplace (Phase 8) — see THREAT_MODEL.md T5.

### Authorization & Scope Gate

- **Purpose**: the single choke point that authorizes or refuses every
  outbound action against a target.
- **Inputs**: run-level Scope config (declared domains/paths, rate limit,
  allowed attack classes, destructive-mode flag); a `PlannedAction` per
  call.
- **Outputs**: `AuthorizationResult` (allow/deny + reason).
- **Events emitted**: `ActionAuthorized`, `ActionDenied` (denials are
  always logged — a denial is itself an important audit signal).
- **Events consumed**: none directly (it's a synchronous gate called via
  the capability handle, not an event subscriber).
- **Dependencies**: Scope config for the run.
- **Future improvements**: richer scope expressions (path globs, header-
  based conditions) as real-world targets demand them.

### Memory System

- **Purpose**: durable, append-only persistence of every event on the bus,
  keyed by run ID — the raw evidence layer.
- **Inputs**: every event published to the bus.
- **Outputs**: a queryable, replayable event log per run.
- **Events emitted**: none.
- **Events consumed**: all (subscribes to everything, writes it durably).
- **Dependencies**: storage layer (SQLite initially).
- **Future improvements**: redaction pass for secrets before any log
  artifact leaves the system (THREAT_MODEL.md T3); retention/encryption
  policy.

---

## Perception Plugins

### Browser Agent

- **Purpose**: drives a real browser to interact with the target's UI.
- **Inputs**: navigation/interaction instructions (from Explorer or a
  human-triggered flow), scoped capability handle.
- **Outputs**: DOM snapshots, screenshots, console logs, triggered network
  traffic.
- **Events emitted**: `PageVisited`, `FormDetected`, `CookieUpdated`,
  `ResponseCaptured` (for XHR/fetch traffic observed), `ConsoleError`.
- **Events consumed**: `NavigateRequested`, `FormSubmitRequested` (from the
  Explorer plugin).
- **Dependencies**: Playwright; Authorization & Scope Gate (via capability
  handle).
- **Future improvements**: multi-tab/multi-context support for testing
  concurrent sessions/roles.

### API Agent

- **Purpose**: direct HTTP(S)/GraphQL client for API interaction, discovery
  replay, and mutation during testing.
- **Inputs**: captured requests (from Browser Agent traffic or recon),
  scoped capability handle.
- **Outputs**: HTTP responses.
- **Events emitted**: `APIDiscovered`, `ResponseCaptured`,
  `AuthHeaderObserved`.
- **Events consumed**: `ResponseCaptured` (from Browser Agent, to seed
  further API calls), `AttackAttempted` (to execute the actual request for
  an attack module's planned mutation).
- **Dependencies**: httpx; Authorization & Scope Gate.
- **Future improvements**: GraphQL-aware request construction (Phase 6).

### Recon Engine

- **Purpose**: light, passive-first information gathering within scope.
- **Inputs**: Scope config.
- **Outputs**: initial seeds (known endpoints, technology fingerprint).
- **Events emitted**: `APIDiscovered` (from OpenAPI/Swagger docs),
  `TechnologyFingerprinted`.
- **Events consumed**: none (runs at the start of a scan).
- **Dependencies**: httpx; Authorization & Scope Gate.
- **Future improvements**: subdomain enumeration within authorized scope
  only.

---

## Modeling Plugins

### Knowledge Graph

- **Purpose**: persistent structural model of the target — pages, forms,
  APIs, roles, resources, and the edges between them.
- **Inputs**: perception events.
- **Outputs**: a queryable graph (SQLite-backed initially).
- **Events emitted**: `NodeAdded`, `EdgeAdded`, `RoleObserved`.
- **Events consumed**: `PageVisited`, `FormDetected`, `APIDiscovered`,
  `LoginSucceeded`, `ResponseCaptured`.
- **Dependencies**: storage layer.
- **Future improvements**: migrate to a dedicated graph DB if query
  patterns (path-finding across large graphs) demand it — see the
  2026-08-02 stack decision in DECISIONS.md.

---

## Reasoning

### Planner

- **Purpose**: LLM-driven reasoning core; consumes Knowledge Graph state
  and the registry of available Attack Plugins, proposes next actions.
- **Inputs**: Knowledge Graph read access, Attack Plugin registry, LiteLLM
  client.
- **Outputs**: `PlannedAction` proposals.
- **Events emitted**: `PlannedActionProposed`.
- **Events consumed**: `NodeAdded`, `EdgeAdded`, `FindingGenerated` (to
  avoid re-proposing already-tested paths).
- **Dependencies**: LiteLLM; Knowledge Graph.
- **Future improvements**: explicit handling of target-derived content as
  untrusted (prompt-injection defense, THREAT_MODEL.md T7) — must be in
  place before Phase 2 exploration goes live, not deferred.

---

## Attack Plugins (registry — grows over time)

### (template entry — duplicate per attack module as built)

### Authentication Testing Module — *(Phase 3)*

- **Purpose**: tests the authentication mechanism itself (credential
  handling, lockout, password reset, session fixation/expiry).
- **Inputs**: scoped capability handle, Knowledge Graph (auth-related
  nodes/edges).
- **Outputs**: `Finding` objects with evidence references.
- **Events emitted**: `AttackAttempted`, `FindingGenerated`.
- **Events consumed**: `LoginSucceeded`, `LoginFailed`, `NodeAdded` (auth-
  related nodes).
- **Dependencies**: Authentication Engine (infra role, not this module),
  Authorization & Scope Gate.
- **Future improvements**: MFA flow testing once a representative practice
  target with MFA is available.

*(Add AuthZ/IDOR, File Upload, XSS, SQLi, SSRF, CSRF, JWT, GraphQL, Rate
Limit, and Secrets Discovery modules here as each is built — see
ROADMAP.md Phases 4–6.)*

---

## Output

### Reporting Engine

- **Purpose**: turns Findings + linked evidence into developer-facing
  reports; diffs against prior runs for regression detection.
- **Inputs**: `FindingGenerated` events, Memory System evidence lookup.
- **Outputs**: structured reports (exploration reports in Phase 2;
  vulnerability reports from Phase 3 on).
- **Events emitted**: `ReportGenerated`.
- **Events consumed**: `FindingGenerated`, `NodeAdded`/`EdgeAdded` (for
  exploration reports).
- **Dependencies**: Memory System, storage layer.
- **Future improvements**: diffing against previous run's report for
  regression detection (Phase 7).
