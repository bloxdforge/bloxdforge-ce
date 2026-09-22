/**
 *  Copyright (c) 2026 khrotu. Apache License 2.0.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import useStudioEvents from "@/components/events/useStudioEvents";
import type { StudioEvent } from "@/components/events/studioEvents";
const DummyModal = () => null;
const createEvent = (overrides: Partial<StudioEvent> = {}): StudioEvent => ({
  id: "event-1",
  title: "Event 1",
  sidebarLabel: "Event 1",
  startAt: "2026-02-10T00:00:00Z",
  endAt: "2026-02-20T00:00:00Z",
  storageKey: "event_1_seen",
  icon: null,
  modal: DummyModal,
  autoOpen: false,
  autoOpenRequiresDelay: false,
  ...overrides,
});
describe("useStudioEvents", () => {
  const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
  const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-02-12T12:00:00Z"));
    getItemSpy.mockReset();
    setItemSpy.mockReset();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  afterAll(() => {
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
  it("returns only active events", async () => {
    const events = [
      createEvent(),
      createEvent({
        id: "event-2",
        title: "Event 2",
        sidebarLabel: "Event 2",
        startAt: "2026-03-01T00:00:00Z",
        endAt: "2026-03-02T00:00:00Z",
        storageKey: "event_2_seen",
      }),
    ];
    const { result } = renderHook(() => useStudioEvents(events));
    await waitFor(() => {
      expect(result.current.activeEvents.map((event) => event.id)).toEqual(["event-1"]);
    });
  });
  it("auto-opens unseen events with delay", async () => {
    getItemSpy.mockReturnValue(null);
    const events = [createEvent({ autoOpen: true, autoOpenRequiresDelay: true })];
    const { result } = renderHook(() => useStudioEvents(events));
    await waitFor(() => {
      expect(result.current.openEvent?.id).toBe("event-1");
      expect(result.current.openEventRequiresDelay).toBe(true);
    });
  });
  it("persists storage when closing an active event", async () => {
    getItemSpy.mockReturnValue(null);
    const events = [createEvent({ autoOpen: true })];
    const { result } = renderHook(() => useStudioEvents(events));
    await waitFor(() => {
      expect(result.current.openEvent?.id).toBe("event-1");
    });
    act(() => {
      result.current.closeEvent();
    });
    expect(setItemSpy).toHaveBeenCalledWith("event_1_seen", expect.any(String));
  });
  it("opens an event manually without delay by default", async () => {
    const events = [createEvent()];
    const { result } = renderHook(() => useStudioEvents(events));
    act(() => {
      result.current.openEventById("event-1");
    });
    await waitFor(() => {
      expect(result.current.openEvent?.id).toBe("event-1");
      expect(result.current.openEventRequiresDelay).toBe(false);
    });
  });
});
