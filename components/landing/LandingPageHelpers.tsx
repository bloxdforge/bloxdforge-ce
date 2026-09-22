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

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
export function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center bg-background md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border border-surface-border md:border-none" data-bf-stat={label.toLowerCase()}>
      <div 
        className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 md:mb-2"
        data-stat-value={value}
      >
        {value}
      </div>
      <div className="text-[10px] sm:text-xs text-text-subtle uppercase tracking-widest font-bold" data-stat-label={label}>
        {label}
      </div>
    </div>
  );
}
export function FeaturePoint({ text }: { text: string }) {
  return (
    <li className="flex items-start md:items-center gap-3 text-gray-300" itemProp="featureList">
      <div className="mt-0.5 md:mt-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <CheckCircle2 size={12} />
      </div>
      <span itemProp="name" className="leading-snug">{text}</span>
    </li>
  );
}
export function TechBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-surface rounded-full border border-white/5 text-xs md:text-sm text-gray-300 whitespace-nowrap">
      {icon}
      <span data-bf-tech={label}>{label}</span>
    </div>
  );
}
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="border border-surface-border rounded-xl bg-background overflow-hidden" 
      itemScope 
      itemType="https://schema.org/Question"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-surface transition-colors"
      >
        <span className="font-bold text-white text-base md:text-lg pr-4" itemProp="name">{question}</span>
        <span className={`text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
          <PlusIcon />
        </span>
      </button>
      <div 
        className={`px-5 md:px-6 text-text-muted text-sm md:text-base leading-relaxed overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 md:pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
        itemProp="acceptedAnswer" 
        itemScope 
        itemType="https://schema.org/Answer"
      >
        <div itemProp="text">{answer}</div>
      </div>
    </div>
  );
}
