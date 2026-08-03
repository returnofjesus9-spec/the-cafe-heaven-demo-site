from __future__ import annotations

import pytest
from pydantic import ValidationError

from aipentester.core.scope import ScopeGate, ScopeViolation
from aipentester.core.scope_config import ScopeConfig


def make_config(**overrides: object) -> ScopeConfig:
    defaults: dict[object, object] = {
        "run_id": "run-1",
        "allowed_domains": ["target.example.com"],
        "allowed_path_prefixes": ["/"],
        "allowed_attack_classes": [],
        "authorized_by": "test-operator",
    }
    defaults.update(overrides)
    return ScopeConfig(**defaults)  # type: ignore[arg-type]


def test_allows_action_within_declared_domain_and_path() -> None:
    gate = ScopeGate(make_config())
    result = gate.check("http:GET", "https://target.example.com/login")
    assert result.allowed is True


def test_denies_action_against_a_different_domain() -> None:
    gate = ScopeGate(make_config())
    result = gate.check("http:GET", "https://evil.example.com/login")
    assert result.allowed is False
    assert "evil.example.com" in result.reason


def test_denies_action_outside_allowed_path_prefixes() -> None:
    gate = ScopeGate(make_config(allowed_path_prefixes=["/app/"]))
    result = gate.check("http:GET", "https://target.example.com/admin/secret")
    assert result.allowed is False
    assert "/admin/secret" in result.reason


def test_allows_action_within_a_restricted_path_prefix() -> None:
    gate = ScopeGate(make_config(allowed_path_prefixes=["/app/"]))
    result = gate.check("http:GET", "https://target.example.com/app/dashboard")
    assert result.allowed is True


def test_denies_attack_action_when_attack_class_not_allowed() -> None:
    gate = ScopeGate(make_config(allowed_attack_classes=[]))
    result = gate.check("attack:xss:reflected_probe", "https://target.example.com/search")
    assert result.allowed is False
    assert "xss" in result.reason


def test_allows_attack_action_when_attack_class_is_allowed() -> None:
    gate = ScopeGate(make_config(allowed_attack_classes=["xss"]))
    result = gate.check("attack:xss:reflected_probe", "https://target.example.com/search")
    assert result.allowed is True


def test_perception_actions_are_not_gated_by_attack_class() -> None:
    # http:GET / browser:navigate are perception, not attack; they should
    # only be gated by domain/path, not by allowed_attack_classes.
    gate = ScopeGate(make_config(allowed_attack_classes=[]))
    result = gate.check("http:GET", "https://target.example.com/")
    assert result.allowed is True


def test_authorize_raises_scope_violation_on_denial() -> None:
    gate = ScopeGate(make_config())
    with pytest.raises(ScopeViolation):
        gate.authorize("http:GET", "https://evil.example.com/")


def test_authorize_does_not_raise_on_allowed_action() -> None:
    gate = ScopeGate(make_config())
    gate.authorize("http:GET", "https://target.example.com/")  # must not raise


def test_wildcard_domains_are_rejected_at_config_construction() -> None:
    with pytest.raises(ValidationError):
        make_config(allowed_domains=["*.example.com"])


def test_unparseable_url_is_denied_not_raised() -> None:
    gate = ScopeGate(make_config())
    result = gate.check("http:GET", "not-a-url")
    assert result.allowed is False
