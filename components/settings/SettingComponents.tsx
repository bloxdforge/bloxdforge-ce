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

import { clsx } from "clsx";
import React from "react";
export function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink",
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-text-muted hover:text-white hover:bg-surface border border-transparent"
      )}
    >
      <span className={active ? "text-primary" : "text-text-subtle"}>{icon}</span>
      {label}
    </button>
  );
}
export function SectionHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="pb-6 border-b border-surface-border">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <p className="text-base text-text-muted mt-2">{description}</p>
    </div>
  );
}
export function ToggleSwitch({ checked, onChange, color = "primary", disabled = false }: { checked: boolean, onChange: () => void, color?: "primary" | "green", disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ${checked ? (color === 'green' ? 'bg-green-600' : 'bg-primary') : 'bg-hairline-strong'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}
export function SettingCard({ title, description, icon, checked, onChange, disabled }: { title: string, description: string, icon: React.ReactNode, checked: boolean, onChange: () => void, disabled?: boolean }) {
  return (
    <div className={`bg-background border border-surface-border rounded-2xl p-6 flex items-center justify-between gap-6 ${disabled ? 'opacity-60' : 'hover:border-white/10 transition-colors'}`}>
      <div className="flex items-start gap-5">
        <div className="p-3 bg-surface-hover rounded-xl text-text-muted mt-1">
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-sm text-text-muted max-w-md leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} disabled={!!disabled} />
    </div>
  );
}
export function RangeSlider({ label, value, min, max, step, onChange, disabled }: { label: string, value: number, min: number, max: number, step: number, onChange: (value: number) => void, disabled?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300 flex justify-between items-center mb-2">
        <span>{label}</span>
        <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{Math.round(value * 100)}%</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer disabled:opacity-50
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:bg-primary
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:transition-all
                   [&::-webkit-slider-thumb]:hover:ring-4
                   [&::-webkit-slider-thumb]:hover:ring-primary/20
                   "
      />
    </div>
  );
}