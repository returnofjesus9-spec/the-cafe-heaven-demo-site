# MASTER_PLAN.md — AI Application Security Engineer

> Source of truth. Read this first, every session. Update whenever architecture
> or vision changes. Never let this go stale.

## Vision

Build an autonomous AI Application Security Engineer: a system that learns how
a target web application works, builds a persistent structural understanding
of it (a "model of the app"), reasons about plausible attack paths against
that model, performs authorized, intelligent penetration testing, and
produces developer-actionable reports. The system continuously re-tests the
application after new deployments to catch regressions.

The differentiator vs. traditional scanners (Burp, ZAP, Nuclei, Nessus-style
tools) is that this system reasons about the application's logic and state
machine rather than pattern-matching known signatures against traffic.

**Legal/ethical scope is foundational, not optional**: this tool is designed
to test applications the operator owns or is explicitly authorized to test
(their own staging/production environments, or environments they hold a
signed engagement/authorization letter for). See THREAT_MODEL.md for the
authorization-gating design — the system must refuse to run against a target
without a positive authorization record.

## Product Goals

- Reduce time-to-first-finding for AppSec teams testing their own products.
- Provide continuous regression testing tied to CI/CD, not just point-in-time
  scans.
- Produce reports developers can act on directly (repro steps, request/response
  evidence, suggested fix, severity, affected code path where derivable).
- Be extensible: new attack classes should be pluggable without touching core
  engine code.
- Be auditable: every action the agent takes against a target is logged,
  attributable, and reproducible.

## Non-Goals (explicitly out of scope)

- This is not a tool for scanning or attacking targets the operator does not
  own or have documented authorization to test. No "scan any URL" mode.
- Not a red-team/offensive-infra product (C2, persistence, lateral movement
  into networks). Scope is application-layer AppSec testing of a single
  target application.
- Not a fuzzing-only or signature-only scanner — that's a means, not the end
  goal.
- Not, in early phases, a replacement for manual pentesters on complex
  business-logic engagements — it's a force multiplier / first-pass tool.

## User Personas

- **AppSec Engineer** at a SaaS company: wants continuous, low-noise testing
  of their own product across deploys.
- **Security-conscious Engineering Lead**: wants a pre-release gate that
  catches common classes of bugs (IDOR, auth bypass, XSS) before ship.
- **Pentest firm operator** (later): wants to accelerate manual engagements
  with an AI-assisted first pass, under a signed SOW/authorization.

## Architecture Overview

Five architectural layers (details in ARCHITECTURE.md):

1. **Perception layer** — Browser Agent + API Agent that interact with the
   live target and observe results.
2. **Modeling layer** — Knowledge Graph + Memory System that turn raw
   observations into a structured, persistent model of the app (pages, forms,
   APIs, roles, state transitions, auth boundaries).
3. **Reasoning layer** — Planner that consumes the model and proposes attack
   paths / next actions; an LLM-driven reasoning core, not hardcoded rules.
4. **Execution layer** — Attack Modules (plugin system) that carry out
   specific test classes (IDOR, XSS, SSRF, etc.) against planned targets.
5. **Reporting layer** — turns findings + evidence into developer-facing
   reports, and diffs new findings against prior runs for regression
   detection.

All layers communicate through well-defined interfaces so any single layer
(e.g., swap Playwright for a different browser driver, or swap the LLM
provider) can be replaced without a rewrite.

## Major Subsystems

The system is event-driven: subsystems communicate exclusively through a
central Event Bus, and every capability (perception, modeling, attack
classes, reporting) is implemented as a plugin behind one common interface.
See ARCHITECTURE.md for the full design and COMPONENTS.md for the
purpose/inputs/outputs/events contract of every individual subsystem.
Summary list:

- Event Bus (core)
- Plugin Loader / Registry (core)
- Authorization & Scope Gate (core — governs what the system is allowed to
  touch; every plugin action routes through it)
- Memory System (core — durably persists every event)
- Browser Agent, API Agent, Recon Engine (perception plugins)
- Knowledge Graph (modeling plugin)
- Planner (reasoning — LLM-driven, consumes the graph, proposes actions)
- Authentication Engine, Authorization Testing Module, File Upload Testing
  Module, and the growing catalog of attack plugins (see ROADMAP.md
  Phases 3–6)
- Reporting Engine (output plugin)

## Milestones

See ROADMAP.md for the phased breakdown. High-level summary:

- **Phase 1**: Repo/infra, browser automation, session handling, scope gate.
- **Phase 2**: Autonomous exploration, state graph, API discovery.
- **Phase 3**: Authentication testing.
- **Phase 4**: Authorization testing (IDOR/BOLA).
- **Phase 5+**: Business logic, injection classes, reporting maturity,
  CI/CD integration, multi-agent orchestration.

## Development Phases (philosophy)

Each phase must produce something independently demonstrable and testable
against a deliberately-vulnerable practice target (e.g., OWASP Juice Shop,
DVWA, WebGoat) before moving to the next. We do not build offensive modules
against real/unknown targets during development.

## Technical Debt

(Track here as it accrues. Empty at project start.)

## Future Ideas

- Plugin marketplace for community attack modules.
- Distributed scanning across many targets for larger orgs.
- GraphQL-aware exploration and testing.
- Fine-tuned/specialized models for specific attack classes.

## Open Questions

- Which browser automation framework (Playwright vs. Puppeteer vs. CDP
  directly)? → to be recorded in DECISIONS.md once decided.
- How is authorization proof captured/verified before a scan is permitted to
  start (signed config, out-of-band approval, domain-ownership check)?
- What's the persistence layer for the Knowledge Graph (graph DB vs.
  relational + graph queries)?
- Multi-tenancy model for the eventual commercial product.
