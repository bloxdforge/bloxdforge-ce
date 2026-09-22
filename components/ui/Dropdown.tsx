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

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";
export interface DropdownOption {
  id: string;
  name: string;
}
interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  openUpward?: boolean;
}
export default function Dropdown({ options, value, onChange, icon, className, openUpward = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.id === value);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className={clsx("relative", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface hover:bg-surface-hover border border-surface-border hover:border-white/20 rounded-lg pl-3 pr-2 py-2 text-xs text-white transition-all group"
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-text-muted group-hover:text-white transition-colors">{icon}</span>}
          <span className="truncate font-medium">{selectedOption?.name || "Select..."}</span>
        </div>
        <ChevronDown
          size={14}
          className={clsx("text-text-subtle transition-transform duration-200", isOpen && "rotate-180 text-white")}
        />
      </button>
      {isOpen && (
        <div className={clsx(
          "absolute left-0 right-0 bg-surface border border-surface-border rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/5",
          openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
        )}>
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2 text-xs text-left rounded-md transition-all",
                  option.id === value
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-gray-300 hover:bg-surface-border hover:text-white"
                )}
              >
                <span>{option.name}</span>
                {option.id === value && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
