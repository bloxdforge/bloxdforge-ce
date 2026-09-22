"use client";

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

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StudioEvent } from "@/components/events/studioEvents";
import { isEventActive } from "@/components/events/studioEvents";
interface OpenOptions {
  requireReadDelay?: boolean;
}
interface StudioEventsState {
  activeEvents: StudioEvent[];
  openEvent: StudioEvent | null;
  openEventRequiresDelay: boolean;
  openEventById: (eventId: string, options?: OpenOptions) => void;
  closeEvent: () => void;
}
const ACTIVE_REFRESH_MS = 60 * 1000;
export default function useStudioEvents(events: StudioEvent[]): StudioEventsState {
  const [activeEvents, setActiveEvents] = useState<StudioEvent[]>([]);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [openEventRequiresDelay, setOpenEventRequiresDelay] = useState(false);
  const eventsById = useMemo(() => {
    return new Map(events.map((event) => [event.id, event]));
  }, [events]);
  const refreshActiveEvents = useCallback(() => {
    const now = Date.now();
    setActiveEvents(events.filter((event) => isEventActive(event, now)));
  }, [events]);
  useEffect(() => {
    refreshActiveEvents();
    const intervalId = window.setInterval(refreshActiveEvents, ACTIVE_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, [refreshActiveEvents]);
  const openEventById = useCallback((eventId: string, options?: OpenOptions) => {
    setOpenEventId(eventId);
    setOpenEventRequiresDelay(Boolean(options?.requireReadDelay));
  }, []);
  const closeEvent = useCallback(() => {
    setOpenEventId(null);
    setOpenEventRequiresDelay(false);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const eventParam = searchParams.get("event");
      if (eventParam && eventsById.has(eventParam)) {
        setOpenEventId(eventParam);
      }
    }
  }, [eventsById]);
  useEffect(() => {
    if (!activeEvents.length) {
      if (openEventId) {
        closeEvent();
      }
      return;
    }
    if (openEventId && !activeEvents.some((event) => event.id === openEventId)) {
      closeEvent();
    }
    if (openEventId) return;
    const autoEvent = activeEvents.find((event) => event.autoOpen);
    if (!autoEvent) return;
    try {
      const hasSeen = localStorage.getItem(autoEvent.storageKey);
      if (!hasSeen) {
        openEventById(autoEvent.id, { requireReadDelay: autoEvent.autoOpenRequiresDelay });
      }
    } catch (error) {
      console.error("Failed to read event state", error);
    }
  }, [activeEvents, openEventById, closeEvent, openEventId]);
  const openEvent = openEventId ? eventsById.get(openEventId) ?? null : null;
  const closeEventWithStorage = useCallback(() => {
    if (openEvent && activeEvents.some((event) => event.id === openEvent.id)) {
      try {
        localStorage.setItem(openEvent.storageKey, new Date().toISOString());
      } catch (error) {
        console.error("Failed to store event state", error);
      }
    }
    closeEvent();
  }, [activeEvents, closeEvent, openEvent]);
  return {
    activeEvents,
    openEvent,
    openEventRequiresDelay,
    openEventById,
    closeEvent: closeEventWithStorage,
  };
}
