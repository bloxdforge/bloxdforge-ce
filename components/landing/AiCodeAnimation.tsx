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

import { useState, useEffect, useMemo, useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal as TerminalIcon, CheckCircle2, TerminalSquare, Loader2 } from "lucide-react";
const codeSnippetBad = `// Inefficiently sends multiple chat messages
onPlayerClick = (id) => {
  api.sendMessage(id, "--- STATS ---");
  api.sendMessage(id, "Health: " + api.getHealth(id));
  api.sendMessage(id, "Shield: " + api.getShield(id));
  api.sendMessage(id, "Kills: " + api.getKills(id));
  api.sendMessage(id, "-------------");
};`;
const codeSnippetGood = `// Optimized into a single message
onPlayerClick = (id) => {
  const stats = [
    "--- STATS ---",
    \`Health: \${api.getHealth(id)}\`,
    \`Shield: \${api.getShield(id)}\`,
    \`Kills: \${api.getKills(id)}\`,
    "-------------",
  ].join('\\n');
  
  api.sendMessage(id, stats);
};`;
const HighlightedCode = ({ code }: { code: string }) => {
  return (
    <SyntaxHighlighter 
      language="javascript" 
      style={vscDarkPlus}
      customStyle={{
        background: 'transparent',
        padding: '0',
        margin: '0',
      }}
      codeTagProps={{
        style: { fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};
export default function AiCodeAnimation({ isPaused }: { isPaused: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'prompt' | 'scanning' | 'writing' | 'complete'>('idle');
  const [typedCode, setTypedCode] = useState(codeSnippetBad);
  const [promptText, setPromptText] = useState("");
  const [activeLogIndex, setActiveLogIndex] = useState(-1);
  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  const toolCalls = useMemo(() => [
    "search_docs({ queries: [\"api.sendMessage performance\"] })",
    "get_current_code({})",
    "replace_all_code({ code: \"optimized script\" })",
    "get_lint_errors({})"
  ], []);
  const lineCount = useMemo(() => Math.max(typedCode.split('\n').length, 12), [typedCode]);
  useEffect(() => {
    let isCancelled = false;
    const waitForPlay = async () => {
      while (isPausedRef.current && !isCancelled) {
        await new Promise(r => setTimeout(r, 200));
      }
    };
    const runSequence = async () => {
      if (isCancelled) return;
      await waitForPlay();
      setPhase('idle');
      setTypedCode(codeSnippetBad);
      setPromptText("");
      setActiveLogIndex(-1);
      await new Promise(r => setTimeout(r, 1200));
      if (isCancelled) return;
      await waitForPlay();
      setPhase('prompt');
      const fullPrompt = "Optimize repeated api.sendMessage calls and verify linting.";
      for (let i = 0; i <= fullPrompt.length; i++) {
        if (isCancelled) return;
        setPromptText(fullPrompt.slice(0, i));
        await new Promise(r => setTimeout(r, 22));
      }
      await new Promise(r => setTimeout(r, 700));
      if (isCancelled) return;
      await waitForPlay();
      setPhase('scanning');
      for (let i = 0; i < toolCalls.length; i++) {
        if (isCancelled) return;
        setActiveLogIndex(i);
        await new Promise(r => setTimeout(r, 950));
      }
      await new Promise(r => setTimeout(r, 400));
      if (isCancelled) return;
      await waitForPlay();
      setPhase('writing');
      setTypedCode(""); 
      let currentCode = "";
      for (let i = 0; i < codeSnippetGood.length; i++) {
          if (isCancelled) return;
          currentCode += codeSnippetGood[i];
          setTypedCode(currentCode);
          await new Promise(r => setTimeout(r, Math.random() * 10 + 8));
      }
      setPhase('complete');
        await new Promise(r => setTimeout(r, 2200));
      if (isCancelled) return;
      await waitForPlay();
      runSequence();
    };
    runSequence();
    return () => {
      isCancelled = true;
    };
  }, [toolCalls.length]);
  return (
    <div className="relative bg-[#0F0F0F] border border-surface-border rounded-xl overflow-hidden shadow-2xl font-mono text-xs md:text-sm h-[320px] md:h-[400px] flex flex-col group">
      <div className="bg-surface border-b border-surface-border px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
        <div className="text-text-subtle text-xs">script.js</div>
      </div>
      <div className="relative flex-1 p-4 overflow-hidden">
        <div className="absolute left-0 top-4 bottom-0 w-8 flex flex-col items-end pr-2 text-gray-700 select-none font-mono text-[10px] leading-relaxed opacity-50">
          {Array.from({ length: lineCount }).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="ml-8 leading-relaxed whitespace-pre-wrap relative z-10">
          <HighlightedCode code={typedCode} />
          {phase === 'writing' && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse align-middle ml-1" />
          )}
        </div>
        {phase === 'scanning' && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="w-full h-[2px] bg-primary/50 shadow-[0_0_20px_rgba(255,107,57,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
          </div>
        )}
        {(phase === 'prompt' || phase === 'scanning') && (
          <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-2">
            {phase === 'prompt' && (
              <div className="bg-surface-elevated border border-surface-border text-white px-3 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                {promptText}
              </div>
            )}
            {phase === 'scanning' && (
              <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 w-64 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                  <TerminalIcon size={12} className="text-primary" />
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Bloxd AI Agent</span>
                </div>
                <div className="space-y-1.5">
                  {toolCalls.map((toolCall, i) => {
                    if (i > activeLogIndex) return null;
                    const isComplete = i < activeLogIndex;
                    return (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-gray-300 animate-in slide-in-from-left-2 fade-in">
                        {!isComplete ? (
                          <Loader2 size={10} className="text-primary animate-spin shrink-0" />
                        ) : (
                          <TerminalSquare size={10} className="text-text-muted shrink-0" />
                        )}
                        <span className="font-mono text-[10px] text-gray-300">{toolCall}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {phase === 'complete' && (
          <div className="absolute bottom-4 right-4 z-30 animate-in zoom-in-95 duration-300">
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={14} />
              Optimization Complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}