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

import { useState, useEffect, useCallback } from 'react';
export interface ToolCallData {
  name: string;
  args: Record<string, string>;
  result?: string;
}
export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };
export interface Message {
  role: "user" | "assistant" | "tool" | "system";
  content: string | ContentPart[];
  reasoning?: string;
  toolCalls?: ToolCallData[];
}
export interface ScriptTabSnapshot {
  id: string;
  name: string;
  code: string;
}
export interface Session {
  id: string;
  name: string;
  messages: Message[];
  tabs?: ScriptTabSnapshot[];
  activeTabId?: string | null;
  updatedAt?: number;
}
export function useChatSessions() {
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [sessionOrder, setSessionOrder] = useState<string[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const createNewSession = useCallback(() => {
    const newId = crypto.randomUUID();
    const newSession: Session = {
      id: newId,
      name: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions(prev => ({ ...prev, [newId]: newSession }));
    setSessionOrder(prev => [newId, ...prev]);
    setActiveSessionId(newId);
    return newId;
  }, []);
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("bloxdforge_chat_session_order");
      const savedSessions = localStorage.getItem("bloxdforge_chat_sessions_v2");
      const savedUnencryptedSessions = localStorage.getItem("bloxdforge_chat_sessions");
      let parsedSessions: Record<string, Session> | null = null;
      /*! SIMPLIFIED START */
      if (savedSessions) {
        parsedSessions = JSON.parse(savedSessions);
      } else if (savedUnencryptedSessions) {
        parsedSessions = JSON.parse(savedUnencryptedSessions);
        localStorage.removeItem("bloxdforge_chat_sessions");
      }
      /*! SIMPLIFIED END */
      if (parsedSessions && savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        if (Object.keys(parsedSessions).length > 0 && parsedOrder.length > 0) {
          setSessions(parsedSessions);
          setSessionOrder(parsedOrder);
          setActiveSessionId(parsedOrder[0] || null);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage, resetting.", e);
      localStorage.removeItem("bloxdforge_chat_sessions_v2");
      localStorage.removeItem("bloxdforge_chat_sessions");
      localStorage.removeItem("bloxdforge_chat_session_order");
    }
    createNewSession();
  }, [createNewSession]);
  useEffect(() => {
    if (Object.keys(sessions).length > 0 && sessionOrder.length > 0) {
      /*! SIMPLIFIED START */
      try {
        localStorage.setItem("bloxdforge_chat_sessions_v2", JSON.stringify(sessions));
        localStorage.setItem("bloxdforge_chat_session_order", JSON.stringify(sessionOrder));
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          const sessionKeys = Object.keys(sessions);
          if (sessionKeys.length > 5) {
            const sorted = sessionOrder.slice(0, 5);
            const trimmed: Record<string, Session> = {};
            for (const id of sorted) {
              if (sessions[id]) trimmed[id] = sessions[id];
            }
            setSessions(trimmed);
            setSessionOrder(sorted);
          }
        }
      }
      /*! SIMPLIFIED END */
    }
  }, [sessions, sessionOrder]);
  const updateSessionMessages = useCallback((sessionId: string, finalMessages: Message[]) => {
    const firstMsg = finalMessages.find(m => m.role === 'user')?.content;
    const firstUserMessage = typeof firstMsg === 'string' ? firstMsg : (Array.isArray(firstMsg) ? firstMsg.filter((p): p is { type: 'text'; text: string } => p.type === 'text').map(p => p.text).join(' ') : '');
    setSessions(prev => {
      const currentSession = prev[sessionId];
      if (!currentSession) return prev;
      const newName = (currentSession.name === "New Chat" && firstUserMessage)
        ? firstUserMessage.substring(0, 25) + (firstUserMessage.length > 25 ? '...' : '')
        : currentSession.name;
      return {
        ...prev,
        [sessionId]: {
          ...currentSession,
          messages: finalMessages,
          name: newName,
          updatedAt: Date.now(),
        },
      };
    });
  }, []);
  const saveSessionTabs = useCallback((sessionId: string, tabs: ScriptTabSnapshot[], activeTabId: string | null) => {
    const snapshot = tabs
      .filter(t => t && typeof t.id === 'string' && typeof t.name === 'string' && typeof t.code === 'string')
      .map(t => ({ id: t.id, name: t.name, code: t.code }));
    setSessions(prev => {
      const current = prev[sessionId];
      if (!current) return prev;
      return {
        ...prev,
        [sessionId]: {
          ...current,
          tabs: snapshot,
          activeTabId,
          updatedAt: Date.now(),
        },
      };
    });
  }, []);
  const updateSessionSnapshot = useCallback((
    sessionId: string,
    snapshot: { messages?: Message[]; tabs?: ScriptTabSnapshot[]; activeTabId?: string | null }
  ) => {
    setSessions(prev => {
      const current = prev[sessionId];
      if (!current) return prev;
      const next: Session = { ...current, updatedAt: Date.now() };
      if (snapshot.messages) {
        const firstMsg = snapshot.messages.find(m => m.role === 'user')?.content;
        const firstUserMessage = typeof firstMsg === 'string' ? firstMsg : (Array.isArray(firstMsg) ? firstMsg.filter((p): p is { type: 'text'; text: string } => p.type === 'text').map(p => p.text).join(' ') : '');
        next.messages = snapshot.messages;
        if (current.name === "New Chat" && firstUserMessage) {
          next.name = firstUserMessage.substring(0, 25) + (firstUserMessage.length > 25 ? '...' : '');
        }
      }
      if (snapshot.tabs) {
        next.tabs = snapshot.tabs
          .filter(t => t && typeof t.id === 'string' && typeof t.name === 'string' && typeof t.code === 'string')
          .map(t => ({ id: t.id, name: t.name, code: t.code }));
      }
      if (snapshot.activeTabId !== undefined) {
        next.activeTabId = snapshot.activeTabId;
      }
      return { ...prev, [sessionId]: next };
    });
  }, []);
  const deleteSession = (idToDelete: string) => {
    if (sessionOrder.length <= 1 && idToDelete === activeSessionId) {
      const newId = crypto.randomUUID();
      const newSession: Session = {
        id: newId,
        name: "New Chat",
        messages: [],
        updatedAt: Date.now(),
      };
      setSessions({ [newId]: newSession });
      setSessionOrder([newId]);
      setActiveSessionId(newId);
    } else {
      const newSessions = { ...sessions };
      delete newSessions[idToDelete];
      setSessions(newSessions);
      const newOrder = sessionOrder.filter(id => id !== idToDelete);
      setSessionOrder(newOrder);
      if (activeSessionId === idToDelete) {
        setActiveSessionId(newOrder[0] || null);
      }
    }
  };
  const switchSession = (idToSwitch: string) => {
    if (idToSwitch !== activeSessionId) {
      setActiveSessionId(idToSwitch);
    }
  };
  const activeSession = activeSessionId ? sessions[activeSessionId] : null;
  return {
    sessions,
    sessionOrder,
    activeSession,
    activeSessionId,
    createNewSession,
    deleteSession,
    switchSession,
    updateSessionMessages,
    saveSessionTabs,
    updateSessionSnapshot,
  };
}