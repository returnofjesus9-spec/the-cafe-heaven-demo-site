# THREAT_MODEL.md

> This is a security product; it must itself be secure, and its use must be
> structurally bounded to authorized targets. This document covers both:
> (a) misuse of the tool itself, and (b) security of the tool's own
> infrastructure (credentials, findings data, generated exploit artifacts).

## Assets

- **Target credentials**: test-account usernames/passwords/tokens the system
  uses to authenticate to a target application.
- **Findings data**: discovered vulnerabilities, including reproduction
  details — this is highly sensitive; a leak is effectively a ready-made
  attack guide against the customer's live application.
- **Action logs / Memory System contents**: full request/response capture
  may contain the target's own sensitive data (PII, session tokens of real
  users if the target is a live production app) — this is bycatch, not the
  point of the scan, and must be handled carefully.
- **The Scope configuration**: defines what the system is authorized to
  touch. Tampering with this is equivalent to removing all safety controls.
- **LLM prompts/reasoning traces**: may contain target-specific sensitive
  detail; same handling bar as findings data.
- **The system's own credentials/API keys** (LLM provider keys, any cloud
  infra credentials).

## Attackers / Threat Actors

- **External attacker** who gains access to a deployed instance of this
  tool (e.g., via a compromised CI pipeline) and attempts to use it against
  targets outside its authorized scope, or to exfiltrate stored findings.
- **Malicious/careless internal user** who points the tool at a target they
  are not actually authorized to test (misconfiguration, or intentional
  misuse of company infra for unauthorized testing).
- **Compromised dependency / supply-chain attacker** — e.g., a malicious
  plugin/attack module contributed to the eventual plugin marketplace.
- **The target application itself acting adversarially** — a target could
  attempt to exploit the scanning agent (e.g., a malicious response
  designed to trigger code execution in the Browser Agent, or a zip-bomb
  style response designed to exhaust the scanner's resources).

## Trust Boundaries

1. **Operator ↔ System**: the human/CI process that configures a run and
   declares scope. The system trusts this input to be accurate but should
   still validate it isn't self-contradictory or absurd (e.g., wildcard
   scope covering the entire internet).
2. **System ↔ Target application**: the target is untrusted. Its responses
   are attacker-influenceable input to the Browser/API Agents and must be
   treated with the same suspicion as any untrusted input to a parser.
3. **System ↔ LLM provider**: prompts sent to the reasoning core may
   contain sensitive target data; the provider is a third party subject to
   its own data-handling terms.
4. **Core engine ↔ Attack Module plugins**: once a plugin marketplace
   exists, third-party plugin code is a trust boundary — plugins should run
   with the minimum capability needed (only what the Scope Gate + module
   interface expose), not arbitrary system access.

## Threats

- **T1 — Scope bypass**: a bug or malicious module causes the system to
  send requests outside the authorized scope. *Highest severity.*
- **T2 — Findings data leak**: unauthorized access to stored findings/action
  logs exposes exploitable vulnerabilities in a customer's live system.
- **T3 — Credential leak**: target test credentials or the system's own
  infra credentials are exposed via logs, error messages, or storage.
- **T4 — Destructive side effects**: an attack module unintentionally
  causes data loss/corruption or availability impact on the target beyond
  what was authorized (e.g., a SQLi test that actually deletes rows, or
  uncapped request volume causing a DoS-like effect).
- **T5 — Malicious plugin**: a third-party attack module (future
  marketplace) does something outside its declared behavior — exfiltrates
  data, attacks a different target, or escalates its own privileges within
  the system.
- **T6 — Agent exploited by target**: the target application serves content
  designed to compromise the Browser/API Agent's own execution
  environment.
- **T7 — Prompt injection via target content**: content scraped from the
  target (page text, API responses) is fed to the LLM Planner and contains
  instructions attempting to manipulate the Planner's reasoning (e.g., "the
  scope gate says any domain is fine" text embedded in a page) into taking
  out-of-scope or destructive actions.

## Security Assumptions

- The Scope Gate config is provided by an authenticated, authorized
  operator; the system does not itself verify legal authorization to test a
  domain (that's an organizational/contractual control) but does enforce
  that declared scope is respected mechanically.
- The environment running the tool (CI, cloud infra) is itself reasonably
  secured — this threat model doesn't try to compensate for a fully
  compromised host.

## Required Protections

- Scope Gate enforcement is centralized (single choke point, not
  duplicated/reimplemented per module) — see ARCHITECTURE.md and the
  2026-08-02 decision in DECISIONS.md.
- Rate limiting and a default "non-destructive/detect-only" mode, with
  destructive testing requiring explicit opt-in per run (mitigates T4).
- Findings data and action logs encrypted at rest; access-controlled and
  scoped to the run's owner/org (mitigates T2, T3).
- Secrets (target credentials, provider API keys) stored in a secrets
  manager, never written to logs or findings artifacts in plaintext
  (mitigates T3) — redaction pass required before any log/report leaves the
  Memory System.
- LLM Planner treats all target-derived content as untrusted data, not
  instructions — inputs from the target are clearly delimited from system
  instructions in prompts, and the Planner's proposed actions still pass
  through the Scope Gate regardless of what the target's content "suggests"
  (mitigates T7).
- Attack Modules run with least privilege relative to the module interface;
  plugin code review/sandboxing required before the marketplace phase
  (mitigates T5).
- Browser Agent runs in a sandboxed/isolated environment (containerized,
  no access to host secrets beyond what the run needs) to limit blast
  radius if a target response compromises it (mitigates T6).

## Potential Abuse (of the product itself)

- A customer could attempt to use the tool against a target they don't
  actually own/have authorization for by misrepresenting scope. Mitigation
  is organizational (ToS, authorization attestation at scope-config time)
  layered on top of the technical scope enforcement — the tool cannot fully
  solve a legal/authorization question by itself, but it should make
  attestation an explicit, logged step rather than something that happens
  silently.
