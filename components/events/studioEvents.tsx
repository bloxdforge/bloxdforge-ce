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

import type { ComponentType, ReactNode } from "react";
import { PartyPopper, HeartHandshake, Trophy } from "lucide-react";
import LogoContestModal from "@/components/events/LogoContestModal";
import AprilFoolsModal from "@/components/events/AprilFoolsModal";
import GoodbyeNoticeModal from "@/components/events/GoodbyeNoticeModal";
export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  requireReadDelay?: boolean;
  eventId: string;
}
export interface StudioEvent {
  id: string;
  title: string;
  sidebarLabel: string;
  startAt: string;
  endAt: string;
  storageKey: string;
  icon: ReactNode;
  modal: ComponentType<EventModalProps>;
  autoOpen: boolean;
  autoOpenRequiresDelay: boolean;
}
export const STUDIO_EVENTS: StudioEvent[] = [
  {
    id: "logo-contest-2026",
    title: "2026 BloxdForge Logo Contest",
    sidebarLabel: "Logo Contest",
    startAt: "2026-02-12T00:00:00Z",
    endAt: "2026-02-28T23:59:59Z",
    storageKey: "bloxdforge_event_logo_contest_2026_seen",
    icon: <Trophy size={18} />,
    modal: LogoContestModal,
    autoOpen: true,
    autoOpenRequiresDelay: true,
  },
  {
    id: "april-fools-2026",
    title: "April Fools 2026",
    sidebarLabel: "April Fools",
    startAt: "2026-03-31T12:00:00Z",
    endAt: "2026-04-02T11:59:59Z",
    storageKey: "bloxdforge_event_april_fools_2026_seen",
    icon: <PartyPopper size={18} />,
    modal: AprilFoolsModal,
    autoOpen: true,
    autoOpenRequiresDelay: true,
  },
  {
    id: "goodbye-notice",
    title: "A Farewell from BloxdForge",
    sidebarLabel: "Farewell",
    startAt: "2026-09-21T00:00:00Z",
    endAt: "2030-01-01T00:00:00Z",
    storageKey: "bloxdforge_event_goodbye_notice_seen",
    icon: <HeartHandshake size={18} />,
    modal: GoodbyeNoticeModal,
    autoOpen: true,
    autoOpenRequiresDelay: true,
  },
];
export const isEventActive = (event: StudioEvent, timestamp: number) => {
  const start = Date.parse(event.startAt);
  const end = Date.parse(event.endAt);
  return timestamp >= start && timestamp <= end;
};
