from __future__ import annotations

import pytest

from aipentester.core.bus import EventBus
from aipentester.core.events import Event, PageVisited


def make_event(run_id: str = "run-1") -> PageVisited:
    return PageVisited(
        run_id=run_id, source_plugin="test", url="https://example.com", status_code=200
    )


@pytest.mark.asyncio
async def test_subscriber_receives_matching_event_type() -> None:
    bus = EventBus()
    received: list[Event] = []

    async def handler(event: Event) -> None:
        received.append(event)

    bus.subscribe(PageVisited, handler)
    event = make_event()
    await bus.publish(event)

    assert received == [event]


@pytest.mark.asyncio
async def test_subscriber_does_not_receive_other_event_types() -> None:
    bus = EventBus()
    received: list[Event] = []

    async def handler(event: Event) -> None:
        received.append(event)

    class OtherEvent(Event):
        pass

    bus.subscribe(OtherEvent, handler)
    await bus.publish(make_event())

    assert received == []


@pytest.mark.asyncio
async def test_wildcard_subscriber_receives_every_event_type() -> None:
    bus = EventBus()
    received: list[Event] = []

    async def handler(event: Event) -> None:
        received.append(event)

    bus.subscribe(Event, handler)  # wildcard, as the Memory System uses
    await bus.publish(make_event())

    assert len(received) == 1
    assert isinstance(received[0], PageVisited)


@pytest.mark.asyncio
async def test_multiple_subscribers_all_receive_the_event() -> None:
    bus = EventBus()
    counts = {"a": 0, "b": 0}

    async def handler_a(event: Event) -> None:
        counts["a"] += 1

    async def handler_b(event: Event) -> None:
        counts["b"] += 1

    bus.subscribe(PageVisited, handler_a)
    bus.subscribe(PageVisited, handler_b)
    await bus.publish(make_event())

    assert counts == {"a": 1, "b": 1}


@pytest.mark.asyncio
async def test_a_raising_handler_does_not_prevent_delivery_to_others() -> None:
    bus = EventBus()
    received: list[Event] = []

    async def bad_handler(event: Event) -> None:
        raise RuntimeError("boom")

    async def good_handler(event: Event) -> None:
        received.append(event)

    bus.subscribe(PageVisited, bad_handler)
    bus.subscribe(PageVisited, good_handler)
    await bus.publish(make_event())  # must not raise

    assert len(received) == 1


@pytest.mark.asyncio
async def test_unsubscribe_stops_delivery() -> None:
    bus = EventBus()
    received: list[Event] = []

    async def handler(event: Event) -> None:
        received.append(event)

    bus.subscribe(PageVisited, handler)
    bus.unsubscribe(PageVisited, handler)
    await bus.publish(make_event())

    assert received == []


@pytest.mark.asyncio
async def test_history_records_every_published_event_in_order() -> None:
    bus = EventBus()
    e1 = make_event()
    e2 = make_event()
    await bus.publish(e1)
    await bus.publish(e2)

    assert bus.history() == [e1, e2]


@pytest.mark.asyncio
async def test_history_for_run_filters_by_run_id() -> None:
    bus = EventBus()
    e1 = make_event(run_id="run-1")
    e2 = make_event(run_id="run-2")
    await bus.publish(e1)
    await bus.publish(e2)

    assert bus.history_for_run("run-1") == [e1]
