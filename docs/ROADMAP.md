# ROADMAP.md

> Phased milestones. Each phase must be independently demonstrable and
> testable before starting the next. Update when milestones change, and note
> the change + reason in DECISIONS.md.

## Phase 0 — Foundations (prerequisite to all offensive capability)

Ordered — each step builds on the previous one:

1. [x] **Finalize the stack** — recorded in DECISIONS.md (2026-08-02).
2. [ ] **Design the Event Bus** — typed event catalog (initial set),
       publish/subscribe API, Memory System auto-subscription for durable
       persistence.
3. [ ] **Design the Plugin System** — `Plugin` interface, `PluginContext`
       (scoped capability handles), discovery/registration mechanism.
       Designed *before* the Scope Gate is implemented, since the Gate is
       consumed through the plugin capability handle, not called directly.
4. [ ] **Design the Scope configuration format** — what an "authorized
       target" declaration looks like (domains, paths, rate limit, allowed
       attack classes, destructive-mode opt-in).
5. [ ] **Repository scaffold** — `uv`-based project, package layout, CI
       skeleton.
6. [ ] **Implement the Authorization & Scope Gate** — first real plugin-
       facing capability; must exist before any plugin can send a single
       request to a target.
7. [ ] **Comprehensive tests** for the Gate, Event Bus, and Plugin loader —
       this trio is the load-bearing core everything else builds on, so it
       gets the highest test bar in the project.
8. [ ] Local practice targets set up (OWASP Juice Shop, DVWA, WebGoat) as
       the only targets used for development and testing throughout
       Phase 0–3.
9. [ ] Structured logging (structlog) wired through the Event Bus →
       Memory System path.

Only after all of the above is the Explorer (Phase 1/2) started.

**Exit criteria**: a run can be started against a practice target; a
plugin's action is correctly refused when the target is outside declared
scope; the full event stream for an approved run is durably logged and
replayable; Gate/Bus/Loader have passing tests.

## Phase 1 — Perception Infrastructure

- [ ] Browser Agent: launch, navigate, form-fill, click, capture DOM +
      network traffic
- [ ] Session handling: cookie/token capture and reuse across requests
- [ ] API Agent: replay captured requests, basic mutation support
- [ ] Memory System: durable storage of observations keyed by run

**Exit criteria**: given a practice target and credentials, the system can
log in via the Browser Agent, capture the session, and record a complete
observation log of one manual-triggered flow.

## Phase 2 — Autonomous Exploration

- [ ] State graph construction (Knowledge Graph v1: pages, forms, links)
- [ ] Autonomous crawling/exploration strategy (avoid infinite loops, respect
      rate limits, detect logout/session-death and recover)
- [ ] API discovery (from network capture + OpenAPI/Swagger + GraphQL
      introspection where present)
- [ ] Structured exploration report (first Reporting Engine output type)

**Exit criteria**: point the system at a practice target with valid test
credentials; it autonomously explores and produces a report of discovered
pages, forms, APIs, and roles — this is the "Initial Development Goal" from
MASTER_PLAN.md.

## Phase 3 — Authentication Testing

- [ ] Auth Testing Module: credential handling, lockout behavior, password
      reset flow analysis, session fixation/expiry checks
- [ ] Multi-persona support (register/manage 2+ test accounts with different
      roles)

**Exit criteria**: module produces findings with evidence against a practice
target with known, seeded auth weaknesses.

## Phase 4 — Authorization Testing (IDOR/BOLA)

- [ ] Cross-persona resource-access testing using the Knowledge Graph's
      captured resource/ID patterns
- [ ] Vertical privilege escalation checks

**Exit criteria**: module correctly identifies seeded IDOR vulnerabilities in
a practice target with a known false-positive rate acceptable for the
milestone (define threshold in DECISIONS.md when reached).

## Phase 5 — Injection & Common Web Vulnerability Classes

- [ ] XSS (reflected/stored, DOM-based)
- [ ] SQL Injection
- [ ] SSRF
- [ ] CSRF
- [ ] File upload attacks (module design already in ARCHITECTURE.md)

## Phase 6 — Advanced / API-Specific Testing

- [ ] JWT analysis
- [ ] GraphQL-specific testing
- [ ] Rate limit testing
- [ ] Secrets discovery (in responses, JS bundles, exposed config)

## Phase 7 — Regression & Continuous Testing

- [ ] Diff findings across runs (Reporting Engine regression detection)
- [ ] GitHub integration (PR checks)
- [ ] CI/CD integration (pipeline gate)

## Phase 8 — Scale & Ecosystem (long-term)

- [ ] Multi-agent orchestration
- [ ] Distributed scanning
- [ ] Plugin marketplace

---

## Milestone Discipline

- No phase begins until the previous phase's exit criteria are met and
  recorded in PROJECT_PROGRESS.md.
- Any change to phase scope or ordering gets a dated entry in DECISIONS.md
  explaining why.
