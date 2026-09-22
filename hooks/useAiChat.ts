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

import { useState, useEffect, useRef } from 'react';
import { DOC_FILES } from "@/lib/docs";
import { lintCode } from '@/lib/bloxd-linter';
import { findBraceImbalance } from '@/lib/tool-args';
import { AiToneId } from "@/lib/ai-models";
const MAX_RECURSION_KEY = 'bloxdforge_ai_max_recursion_depth';
const MAX_REPEATED_TOOLS_KEY = 'bloxdforge_ai_max_repeated_tool_calls';
const DEFAULT_MAX_RECURSION = 20;
const DEFAULT_MAX_REPEATED = 10;
function getNumberSetting(key: string, fallback: number) {
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  const parsed = Number.parseInt(raw || '', 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, parsed);
}
function limitActive(limit: number): boolean {
  return limit > 0;
}
function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean);
  }
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return normalizeStringList(parsed);
    } catch {
      return [trimmed];
    }
  }
  return [trimmed];
}
function hasVisibleAssistantContent(content: string): boolean {
  return content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/gi, "")
    .replace(/```(?:thinking|reasoning)[\s\S]*?```/gi, "")
    .replace(/```(?:thinking|reasoning)[\s\S]*$/gi, "")
    .trim().length > 0;
}
function areMessagesEqual(a: Message[], b: Message[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    const left = a[index];
    const right = b[index];
    if (
      left.role !== right.role ||
      left.content !== right.content ||
      left.reasoning !== right.reasoning ||
      left.usage?.total_tokens !== right.usage?.total_tokens ||
      left.usage?.prompt_tokens !== right.usage?.prompt_tokens ||
      left.usage?.completion_tokens !== right.usage?.completion_tokens ||
      left.usage?.cost !== right.usage?.cost ||
      left.name !== right.name ||
      left.tool_call_id !== right.tool_call_id
    ) {
      return false;
    }
    const leftTools = left.tool_calls || [];
    const rightTools = right.tool_calls || [];
    if (leftTools.length !== rightTools.length) return false;
    for (let toolIndex = 0; toolIndex < leftTools.length; toolIndex += 1) {
      const leftTool = leftTools[toolIndex];
      const rightTool = rightTools[toolIndex];
      if (
        leftTool.id !== rightTool.id ||
        leftTool.type !== rightTool.type ||
        leftTool.function.name !== rightTool.function.name ||
        leftTool.function.arguments !== rightTool.function.arguments
      ) {
        return false;
      }
    }
  }
  return true;
}
export interface ToolCallData {
  id?: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
}
export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };
export interface Message {
  role: "user" | "assistant" | "tool" | "system";
  content: string | ContentPart[];
  reasoning?: string;
  usage?: UsageData;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
  name?: string;
}
export interface UsageData {
  completion_tokens?: number;
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
  cost?: number;
  cost_details?: {
    upstream_inference_cost?: number;
  };
  prompt_tokens?: number;
  prompt_tokens_details?: {
    cached_tokens?: number;
    cache_write_tokens?: number;
    audio_tokens?: number;
  };
  total_tokens?: number;
}
export interface WikiItem {
  title: string;
  tag: string;
  description: string;
  content: string;
}
interface UseAiChatProps {
  model: string;
  tone: AiToneId;
  sessionId?: string;
  editorCode: string;
  wikiData: WikiItem[];
  initialMessages: Message[];
  onComplete: (finalMessages: Message[]) => void;
  onCodeUpdate: (newCode: string) => void;
  onError?: (error: Error) => void;
  tabs?: {
    list: { id: string; name: string; code: string; modified?: boolean }[];
    activeId: string | null;
    getCode: (id: string) => string;
    updateCode: (id: string, newCode: string) => void;
    markModified: (id: string) => void;
    create: (name?: string, content?: string) => { id: string; name: string; code: string };
  };
}
interface UseAiChatReturn {
  messages: Message[];
  latestUsage: UsageData | null;
  isLoading: boolean;
  activeTool: string | null;
  sendMessage: (input: string, turnstileToken: string, overrideHistory?: Message[], overrideModel?: string, attachments?: ContentPart[]) => Promise<void>;
  resubmitLast: (turnstileToken: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  stopGeneration: () => void;
}
export function useAiChat({ 
  model, 
  tone,
  sessionId,
  editorCode, 
  wikiData, 
  initialMessages, 
  onComplete,
  onCodeUpdate,
  onError,
  tabs
}: UseAiChatProps): UseAiChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [latestUsage, setLatestUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const recursionDepth = useRef(0);
  const recentToolCalls = useRef<string[]>([]);
  const docCache = useRef<Record<string, string>>({});
  const tabListCacheRef = useRef<{ id: string; name: string; code: string; modified?: boolean }[]>([]);
  const activeTabIdCacheRef = useRef<string | null>(null);
  const tabCodeCacheRef = useRef<Record<string, string>>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const aiLimitsRef = useRef({ maxRecursionDepth: DEFAULT_MAX_RECURSION, maxRepeatedToolCalls: DEFAULT_MAX_REPEATED });
  useEffect(() => {
    setMessages(current => areMessagesEqual(current, initialMessages) ? current : initialMessages);
    const nextLatestUsage = [...initialMessages]
      .reverse()
      .find(message => message.role === 'assistant' && message.usage)?.usage ?? null;
    setLatestUsage(nextLatestUsage);
  }, [initialMessages]);
  useEffect(() => {
    const next: Record<string, string> = {};
    tabs?.list.forEach(t => { next[t.id] = t.code; });
    tabCodeCacheRef.current = next;
    tabListCacheRef.current = tabs?.list ?? [];
    activeTabIdCacheRef.current = tabs?.activeId ?? null;
  }, [tabs]);
  const refreshAiLimits = () => {
    aiLimitsRef.current = {
      maxRecursionDepth: getNumberSetting(MAX_RECURSION_KEY, DEFAULT_MAX_RECURSION),
      maxRepeatedToolCalls: getNumberSetting(MAX_REPEATED_TOOLS_KEY, DEFAULT_MAX_REPEATED),
    };
  };
  const validateJsBeforeApply = (code: string): string | null => {
    const imbalance = findBraceImbalance(code);
    if (imbalance) {
      return `Error: Refusing to apply code with unbalanced braces: ${imbalance} Run lint_code, fix the braces, and re-emit write_code with the complete file.`;
    }
    const syntaxErrors = lintCode(code).filter(e => e.severity === 'error' && e.message.startsWith('Syntax Error'));
    if (syntaxErrors.length > 0) {
      const first = syntaxErrors[0];
      return `Error: Refusing to apply code with syntax error on line ${first.line}: ${first.message} Fix it and re-emit write_code with the complete file.`;
    }
    return null;
  };
  const fuzzyFindPatch = (editorCode: string, search: string): { index: number; matched: string } | null => {
    if (editorCode.includes(search)) {
      return { index: editorCode.indexOf(search), matched: search };
    }
    const normalize = (s: string) => s.replace(/[ \t]+/g, ' ').replace(/[ \t]*\n[ \t]*/g, '\n').trim();
    const normEditor = normalize(editorCode);
    const normSearch = normalize(search);
    const idx = normEditor.indexOf(normSearch);
    if (idx === -1) return null;
    const editorLines = editorCode.split('\n');
    const searchLines = search.split('\n').map(l => l.trim()).filter(Boolean);
    if (searchLines.length === 0) return null;
    for (let i = 0; i < editorLines.length; i++) {
      let ok = true;
      for (let j = 0; j < searchLines.length; j++) {
        if ((editorLines[i + j] ?? '').trim() !== searchLines[j]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        const matched = editorLines.slice(i, i + searchLines.length).join('\n');
        return { index: editorCode.indexOf(matched), matched };
      }
    }
    return null;
  };
  const executeTool = async (toolName: string, args: Record<string, unknown>, codeForTool: string): Promise<[string, string | null]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const resolveTab = (): { id: string | null; name: string; code: string; isActive: boolean } | null => {
      if (!tabs) return null;
      const raw = typeof args.tab === 'string' && args.tab.trim() ? String(args.tab).trim() : '';
      const availableTabs = tabListCacheRef.current;
      const activeTabId = activeTabIdCacheRef.current;
      let target = availableTabs.find(t => t.id === activeTabId) || null;
      if (raw) {
        const byId = availableTabs.find(t => t.id === raw);
        const byName = availableTabs.find(t => t.name.toLowerCase() === raw.toLowerCase());
        const idx = Number(raw);
        const byIndex = Number.isFinite(idx) && idx >= 1 && idx <= availableTabs.length ? availableTabs[idx - 1] : undefined;
        target = byId || byName || byIndex || target;
      }
      if (!target) return null;
      return { id: target.id, name: target.name, code: tabCodeCacheRef.current[target.id] ?? tabs.getCode(target.id), isActive: target.id === activeTabId };
    };
    const applyToTab = (id: string | null, newCode: string): string | null => {
      if (id) {
        tabCodeCacheRef.current[id] = newCode;
        tabs?.updateCode(id, newCode);
        if (id !== activeTabIdCacheRef.current) tabs?.markModified(id);
        return newCode;
      }
      onCodeUpdate(newCode);
      return newCode;
    };
    if (toolName === "create_tab") {
      if (!tabs) return ["Tabs are not available in this context.", null];
      const requestedName = typeof args.name === 'string' ? args.name : undefined;
      const content = typeof args.content === 'string' ? args.content : undefined;
      if (content !== undefined) {
        const rejection = validateJsBeforeApply(content);
        if (rejection) return [rejection, null];
      }
      const created = tabs.create(requestedName, content);
      const createdCode = content ?? created.code;
      tabCodeCacheRef.current[created.id] = createdCode;
      tabListCacheRef.current = [...tabListCacheRef.current, { ...created, code: createdCode }];
      activeTabIdCacheRef.current = created.id;
      const contentSummary = content === undefined ? 'starter code' : `${createdCode.length} characters of code`;
      return [`Success: Created tab "${created.name}" (id: ${created.id}) with ${contentSummary}.`, null];
    }
    if (toolName === "list_tabs") {
      if (!tabs) return ["Tabs are not available in this context.", null];
      const availableTabs = tabListCacheRef.current;
      if (!availableTabs.length) return ["No script tabs available.", null];
      const lines = availableTabs.map((t, i) => {
        const active = t.id === activeTabIdCacheRef.current ? " [ACTIVE]" : "";
        const modified = t.modified ? " [MODIFIED]" : "";
        return `${i + 1}. "${t.name}" (id: ${t.id})${active}${modified}`;
      });
      return [`Available tabs:\n${lines.join('\n')}\n\nTo read or edit a specific tab, pass its name, id, or number in the "tab" argument.`, null];
    }
    if (toolName === "read_code") {
      if (tabs) {
        const resolved = resolveTab();
        if (resolved) {
          return [`Current code in "${resolved.name}":\n\`\`\`javascript\n${resolved.code}\n\`\`\``, null];
        }
      }
      return [`Current Editor Code:\n\`\`\`javascript\n${codeForTool}\n\`\`\``, null];
    }
    if (toolName === "lint_code") {
      const targetCode = tabs ? (resolveTab()?.code ?? codeForTool) : codeForTool;
      const currentLintErrors = lintCode(targetCode);
      if (currentLintErrors.length === 0) {
        return ["No linting errors found.", null];
      }
      return [`Found ${currentLintErrors.length} linting errors:\n` + 
        currentLintErrors.map(e => `- Line ${e.line}: [${e.severity}] ${e.message}`).join("\n"), null];
    }
    if (toolName === "write_code") {
      const newCode = args.code as string;
      if (typeof newCode !== 'string') return ["Error: Missing or invalid 'code' argument. Re-emit write_code with the complete file in the 'code' field.", null];
      const rejection = validateJsBeforeApply(newCode);
      if (rejection) return [rejection, null];
      const resolved = tabs ? resolveTab() : null;
      applyToTab(resolved?.id ?? null, newCode);
      return [`Success: ${resolved ? `Code in tab "${resolved.name}" replaced` : "Entire code replaced"} successfully.`, newCode];
    }
    if (toolName === "patch_code") {
      const search = args.search as string;
      const replace = args.replace as string;
      if (!search) return ["Error: Missing 'search' argument.", null];
      const resolved = tabs ? resolveTab() : null;
      const targetCode = resolved?.code ?? codeForTool;
      const normalizedEditorCode = targetCode.replace(/\r\n/g, "\n");
      const normalizedSearch = search.replace(/\r\n/g, "\n");
      const normalizedReplace = (replace || "").replace(/\r\n/g, "\n");
      const hit = fuzzyFindPatch(normalizedEditorCode, normalizedSearch);
      if (hit) {
        const newCode = normalizedEditorCode.slice(0, hit.index) + normalizedReplace + normalizedEditorCode.slice(hit.index + hit.matched.length);
        const rejection = validateJsBeforeApply(newCode);
        if (rejection) return [rejection, null];
        applyToTab(resolved?.id ?? null, newCode);
        return [`Success: Code updated${resolved ? ` in tab "${resolved.name}"` : ""} successfully.`, newCode];
      } else {
        return ["Error: Could not find the exact code segment specified in the 'search' argument. Call read_code first, copy the block exactly, then retry. If it fails again, use write_code with the full file.", null];
      }
    }
    if (toolName === "read_docs") {
      const filenames = normalizeStringList(args.filenames ?? args.filename);
      if (!filenames.length) return ["Error: Missing 'filenames' argument.", null];
      let results = '';
      for (const filename of filenames) {
        const docFile = DOC_FILES.find(d => d.name === filename);
        if (docFile) {
          try {
            const res = await fetch(docFile.url);
            const text = await res.text();
            results += `Contents of ${filename}:\n\n${text}\n\n`;
          } catch { results += `Error reading file ${filename}.\n\n`; }
        } else { results += `Error: File '${filename}' not found.\n\n`; }
      }
      return [results.trim(), null];
    }
    if (toolName === "search_docs") {
      const queries = normalizeStringList(args.queries ?? args.query);
      const limit = typeof args.limit === 'number' ? args.limit : 3;
      if (!queries.length) return ["Error: Missing 'queries' argument.", null];
      let results = '';
      const normalizedQueries = queries.map(q => q.toLowerCase()).filter(Boolean);
      for (const query of normalizedQueries) {
        let queryResults = '';
        for (const docFile of DOC_FILES) {
          let content = docCache.current[docFile.name];
          if (!content) {
            try {
              const res = await fetch(docFile.url);
              content = await res.text();
              docCache.current[docFile.name] = content;
            } catch { continue; }
          }
          const lines = content.split('\n');
          const matchingLines: string[] = [];
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query)) {
              const context = lines.slice(Math.max(0, index - 5), Math.min(lines.length, index + 6)).join('\n');
              matchingLines.push(`...\n${context}\n...`);
            }
          });
          if (matchingLines.length > 0) queryResults += `From ${docFile.name}:\n${matchingLines.slice(0, limit).join('\n---\n')}\n\n`;
        }
        if (queryResults) {
          results += `Results for "${query}":\n${queryResults}`;
        } else {
          results += `No results found for "${query}" in API documentation.\n\n`;
        }
      }
      return [results.trim(), null];
    }
    if (toolName === "search_wiki") {
      const queries = normalizeStringList(args.queries ?? args.query);
      if (!queries.length) return ["Error: Missing 'queries' argument.", null];
      let resultsText = '';
      const normalizedQueries = queries.map(q => q.toLowerCase()).filter(Boolean);
      for (const query of normalizedQueries) {
        const results = wikiData.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.tag.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        ).slice(0, 5);
        if (results.length > 0) {
          resultsText += `Wiki Search Results for "${query}":\n\n` + 
            results.map(r => `---\nTitle: ${r.title}\nTag: ${r.tag}\nDescription: ${r.description}\nContent: ${r.content}\n---`).join("\n\n") + "\n\n";
        } else {
          resultsText += `No wiki results found for "${query}".\n\n`;
        }
      }
      return [resultsText.trim(), null];
    }
    return ["Error: Unknown tool.", null];
  };
  const fetchAiResponse = async (history: Message[], codeForThisTurn: string, turnstileToken: string, overrideModel?: string, emptyResponseRetry = 0) => {
    refreshAiLimits();
    if (limitActive(aiLimitsRef.current.maxRecursionDepth) && recursionDepth.current >= aiLimitsRef.current.maxRecursionDepth) {
      setMessages(prev => [...prev, { role: "assistant", content: "I hit the configured recursion limit and stopped to avoid repeating actions. You can raise it (or set 0 for unlimited) in the AI Settings, or ask me to use write_code." }]);
      setIsLoading(false);
      return;
    }
    const toolCallsFromStream: { id: string; name: string; args: Record<string, unknown> }[] = [];
    const toolParseErrors: { id: string; name: string; error: string }[] = [];
    try {
      const storedKey = localStorage.getItem("bloxdforge_nvidia_key");
      abortControllerRef.current = new AbortController();
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(storedKey ? { "X-OpenRouter-Key": storedKey } : {}),
        },
        body: JSON.stringify({
          messages: history,
          model: overrideModel || model,
          tone,
          turnstileToken,
          sessionId
        }),
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({error: 'An unknown error occurred'}));
        throw new Error(errorData.error || response.statusText);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      const assistantMessage: Message = { role: "assistant", content: "", reasoning: "" };
      setMessages(prev => [...prev, assistantMessage]);
      let buffer = "";
      let ignoreFurtherContent = false;
      let streamedContent = "";
      let streamedReasoning = "";
      let finishReason: string | null = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === 'usage' && data.usage) {
              const usage = data.usage as UsageData;
              setLatestUsage(usage);
              setMessages(prev => {
                const newMsgs = [...prev];
                const lastIndex = newMsgs.length - 1;
                if (lastIndex >= 0 && newMsgs[lastIndex].role === 'assistant') {
                  newMsgs[lastIndex] = { ...newMsgs[lastIndex], usage };
                }
                return newMsgs;
              });
              continue;
            }
            if (data.type === 'tool_call') {
              toolCallsFromStream.push({ id: data.id, name: data.name, args: data.args || {} });
              ignoreFurtherContent = true;
              continue;
            }
            if (data.type === 'tool_parse_error') {
              toolParseErrors.push({
                id: typeof data.id === 'string' ? data.id : `parse-${Date.now()}`,
                name: typeof data.name === 'string' && data.name ? data.name : 'unknown',
                error: typeof data.error === 'string' ? data.error : 'Tool arguments are not valid JSON.',
              });
              ignoreFurtherContent = true;
              continue;
            }
            if (data.type === 'finish') {
              finishReason = typeof data.reason === 'string' ? data.reason : null;
              continue;
            }
            if (ignoreFurtherContent) continue;
            const streamedValue = typeof data.content === 'string' ? data.content : "";
            if (data.type === 'reasoning') streamedReasoning += streamedValue;
            else if (data.type === 'content') streamedContent += streamedValue;
            setMessages(prev => {
              const newMsgs = [...prev];
              const lastMsg = { ...newMsgs[newMsgs.length - 1] };
              if (data.type === 'reasoning') {
                lastMsg.reasoning = (lastMsg.reasoning || "") + streamedValue;
              } else if (data.type === 'content') {
                lastMsg.content = (lastMsg.content || "") + streamedValue;
              }
              newMsgs[newMsgs.length - 1] = lastMsg;
              return newMsgs;
            });
          } catch { }
        }
      }
      if (toolParseErrors.length > 0) {
        const parseError = toolParseErrors[0];
        recursionDepth.current += 1;
        const toolCallObj = {
          id: parseError.id,
          type: 'function' as const,
          function: { name: parseError.name, arguments: '{}' }
        };
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], tool_calls: [toolCallObj] };
          return newMsgs;
        });
        const toolMessage: Message = {
          role: "tool",
          tool_call_id: parseError.id,
          name: parseError.name,
          content: `Error: ${parseError.error} Re-emit the tool call with valid JSON and the complete code.`
        };
        setMessages(prev => [...prev, toolMessage]);
        const finalAssistantMsg: Message = {
          ...assistantMessage,
          content: streamedContent,
          reasoning: streamedReasoning,
          tool_calls: [toolCallObj]
        };
        const nextHistory = [...history, finalAssistantMsg, toolMessage];
        setActiveTool(null);
        await fetchAiResponse(nextHistory, codeForThisTurn, turnstileToken, overrideModel);
        return;
      }
      if (toolCallsFromStream.length > 0) {
        const currentToolCall = toolCallsFromStream[0];
        recursionDepth.current += 1;
        const toolSignature = `${currentToolCall.name}:${JSON.stringify(currentToolCall.args || {})}`;
        recentToolCalls.current = [...recentToolCalls.current.slice(-5), toolSignature];
        const repeatedCount = recentToolCalls.current.filter(sig => sig === toolSignature).length;
        if (limitActive(aiLimitsRef.current.maxRepeatedToolCalls) && repeatedCount >= aiLimitsRef.current.maxRepeatedToolCalls) {
          setIsLoading(false);
          recursionDepth.current = 0;
          setActiveTool(null);
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `I stopped because the same tool call repeated multiple times (${currentToolCall.name}). Please provide a more specific instruction or request a full rewrite with write_code.`
          }]);
          return;
        }
        const toolCallObjs = toolCallsFromStream.map(t => ({
          id: t.id,
          type: 'function' as const,
          function: { name: t.name, arguments: JSON.stringify(t.args) }
        }));
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], tool_calls: toolCallObjs };
          return newMsgs;
        });
        const toolMessages: Message[] = [];
        let workingCode = codeForThisTurn;
        for (const tool of toolCallsFromStream) {
          setActiveTool(tool.name);
          const [toolResult, newCode] = await executeTool(tool.name, tool.args, workingCode);
          if (newCode !== null) workingCode = newCode;
          const toolMessage: Message = {
            role: "tool",
            tool_call_id: tool.id,
            name: tool.name,
            content: toolResult
          };
          toolMessages.push(toolMessage);
          setMessages(prev => [...prev, toolMessage]);
        }
        const finalAssistantMsg: Message = {
          ...assistantMessage,
          content: streamedContent,
          reasoning: streamedReasoning,
          tool_calls: toolCallObjs
        };
        const nextHistory = [...history, finalAssistantMsg, ...toolMessages];
        setActiveTool(null);
        await fetchAiResponse(nextHistory, workingCode, turnstileToken, overrideModel);
      } else {
        const hasVisibleContent = hasVisibleAssistantContent(streamedContent);
        if (!hasVisibleContent && finishReason !== "content_filter" && emptyResponseRetry < 1) {
          setMessages(prev => prev.length > 0 && prev[prev.length - 1].role === "assistant" ? prev.slice(0, -1) : prev);
          await fetchAiResponse(history, codeForThisTurn, turnstileToken, overrideModel, emptyResponseRetry + 1);
          return;
        }
        setIsLoading(false);
        recursionDepth.current = 0;
        recentToolCalls.current = [];
        if (!hasVisibleContent) {
          const fallbackMessage: Message = {
            role: "assistant",
            content: finishReason === "length"
              ? "The model used its reasoning budget before producing a response. Please try again."
              : "The model stopped before producing a response. Please try again."
          };
          setMessages(current => {
            const nextMessages = [...current, fallbackMessage];
            onComplete(nextMessages);
            return nextMessages;
          });
        } else {
          setMessages(current => {
            onComplete(current);
            return current;
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      const e = error instanceof Error ? error : new Error('Connection failed');
      const isBlockingError = e.message.toLowerCase().includes('captcha') ||
          e.message.toLowerCase().includes('api key is missing') ||
          e.message.toLowerCase().includes('api key is invalid');
      setIsLoading(false);
      if (isBlockingError) {
        onError?.(e);
        return;
      }
      setMessages(prev => [...prev, { role: "assistant", content: `**Error:** ${e.message}` }]);
      onError?.(e);
    } finally {
      abortControllerRef.current = null;
    }
  };
  const sendMessage = async (input: string, turnstileToken: string, overrideHistory?: Message[], overrideModel?: string, attachments?: ContentPart[]) => {
    if (!input.trim() && !attachments?.length) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    refreshAiLimits();
    setLatestUsage(null);
    recentToolCalls.current = [];
    const content: string | ContentPart[] = attachments && attachments.length > 0
      ? [...attachments, { type: 'text', text: input }]
      : input;
    const userMsg: Message = { role: "user", content };
    const newHistory = [...(overrideHistory || messages), userMsg];
    setMessages(newHistory);
    setIsLoading(true);
    recursionDepth.current = 0;
    await fetchAiResponse(newHistory, editorCode, turnstileToken, overrideModel);
  };
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setMessages(prev => [...prev, { role: "assistant", content: "[Generation stopped by user]" }]);
    }
  };
  const resubmitLast = async (token: string) => {
    if (isLoading) return;
    const history = messages;
    const lastUserIndex = [...history].reverse().findIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;
    const targetUser = history[history.length - 1 - lastUserIndex];
    const historyBefore = history.slice(0, history.length - 1 - lastUserIndex);
    const nextHistory = [...historyBefore, targetUser];
    setMessages(nextHistory);
    setIsLoading(true);
    recursionDepth.current = 0;
    recentToolCalls.current = [];
    setLatestUsage(null);
    await fetchAiResponse(nextHistory, editorCode, token);
  };
  return { messages, latestUsage, setMessages, isLoading, activeTool, sendMessage, resubmitLast, stopGeneration };
}
