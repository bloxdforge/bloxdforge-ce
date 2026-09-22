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

import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
type TourAction = 'openEditor' | 'closeEditor' | 'showNewPackInput';
interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: TourAction;
}
const STEPS: TourStep[] = [
    {
        targetId: 'tour-header',
        title: 'Managing Your Packs',
        content: 'This is the pack selection screen. From here, you can create, open, rename, and delete your texture packs.',
        position: 'bottom',
    },
    {
        targetId: 'tour-create-pack-button',
        title: 'Create a New Pack',
        content: 'First, you need to create a pack. The tour will now open the input field for you.',
        position: 'left',
        action: 'showNewPackInput',
    },
    {
        targetId: 'tour-new-pack-input',
        title: 'Name Your Pack',
        content: 'Give your new pack a name here and click "Create". For this tour, we\'ve made an example pack for you.',
        position: 'bottom',
    },
    {
        targetId: 'tour-pack-list-container',
        title: 'Open & Rename Packs',
        content: 'Your packs appear here. Hover to find the rename icon. The tour will now open the editor for this pack.',
        position: 'right',
        action: 'openEditor',
    },
    {
        targetId: 'tour-create-file-button',
        title: 'Create Textures & CSS',
        content: 'Inside the editor, use this button to create new files. You can choose between a blank texture (.png) or a stylesheet (.css).',
        position: 'right',
    },
    {
        targetId: 'tour-canvas-container',
        title: 'Pixel & Code Editor',
        content: 'When you select a texture, this area becomes a pixel-perfect drawing canvas. For a .css file, it becomes a code editor.',
        position: 'bottom',
    },
    {
        targetId: 'tour-canvas-container',
        title: 'Voxel Editor',
        content: 'Opening a .glb file automatically loads our built-in voxel editor. Create and edit 3D models natively without leaving the app.',
        position: 'bottom',
    },
    {
        targetId: 'tour-download-button',
        title: 'Download Your Pack',
        content: 'When finished, click here to download all your files as a .zip. The tour will now return to the pack selection screen.',
        position: 'right',
        action: 'closeEditor',
    },
    {
        targetId: 'tour-pack-list-container',
        title: 'Deleting a Pack',
        content: 'To delete a pack, hover over it on this screen to reveal and click the trash icon. This action is permanent.',
        position: 'right',
    },
];
interface StudioTourProps {
  onFinish: () => void;
  isFirstTime: boolean;
  onAction: (action: TourAction) => void;
}
export default function StudioTour({ onFinish, isFirstTime, onAction }: StudioTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [popoverStyle, setPopoverStyle] = useState({});
  const [showWelcome, setShowWelcome] = useState(isFirstTime);
  const popoverRef = useRef<HTMLDivElement>(null);
  const currentStep = STEPS[stepIndex];
  useEffect(() => {
    document.body.style.scrollBehavior = 'auto';
    return () => {
      document.body.style.scrollBehavior = 'smooth';
    };
  }, []);
  useLayoutEffect(() => {
    const updateStyles = () => {
      const el = document.getElementById(currentStep.targetId);
      const popoverEl = popoverRef.current;
      if (!el || !popoverEl) return;
      el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      const rect = el.getBoundingClientRect();
      setHighlightStyle({
        width: `${rect.width + 16}px`,
        height: `${rect.height + 16}px`,
        top: `${rect.top - 8}px`,
        left: `${rect.left - 8}px`,
      });
      const popoverHeight = popoverEl.offsetHeight;
      const popoverWidth = popoverEl.offsetWidth;
      const margin = 16;
      let top = 0, left = 0;
      const position = currentStep.position || 'bottom';
      switch(position) {
          case 'top': top = rect.top - popoverHeight - margin; left = rect.left + (rect.width / 2) - (popoverWidth / 2); break;
          case 'bottom': top = rect.bottom + margin; left = rect.left + (rect.width / 2) - (popoverWidth / 2); break;
          case 'left': top = rect.left - popoverWidth - margin; left = rect.top + (rect.height / 2) - (popoverHeight / 2); break;
          case 'right': top = rect.top + (rect.height / 2) - (popoverHeight / 2); left = rect.right + margin; break;
      }
      left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - popoverHeight - margin));
      setPopoverStyle({ top: `${top}px`, left: `${left}px` });
    };
    const observer = new MutationObserver(() => {
        if (document.getElementById(currentStep.targetId)) {
            updateStyles();
            observer.disconnect();
        }
    });
    if (document.getElementById(currentStep.targetId)) {
        requestAnimationFrame(updateStyles);
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [stepIndex, currentStep]);
  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      const nextStepIndex = stepIndex + 1;
      if (currentStep.action) {
        onAction(currentStep.action);
      }
      setStepIndex(nextStepIndex);
    } else {
      if (currentStep.action) onAction(currentStep.action);
      onFinish();
    }
  };
  const handlePrev = () => {
    const prevStepIndex = Math.max(0, stepIndex - 1);
    const prevStep = STEPS[prevStepIndex];
     if (prevStep.action === 'closeEditor') {
       onAction('closeEditor');
     }
    setStepIndex(prevStepIndex);
  }
  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-background border border-surface-border rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Welcome to the Texture Studio!</h2>
          <p className="text-text-muted mb-6">This quick tour will guide you through the main features. You can exit at any time or restart the tour later from this screen.</p>
          <button onClick={() => setShowWelcome(false)} className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-sm shadow-primary/10">
            Start Tour
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[200]">
      <div 
        className="absolute border-2 border-primary rounded-lg transition-[top,left,width,height] duration-300"
        style={{ ...highlightStyle, boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)' }}
      />
      <div 
        ref={popoverRef}
        className="absolute w-72 bg-surface border border-surface-border rounded-lg shadow-2xl p-4 transition-[top,left] duration-300 animate-in fade-in zoom-in-95"
        style={popoverStyle}
      >
        <h3 className="font-bold text-white mb-2">{currentStep.title}</h3>
        <p className="text-sm text-text-muted mb-4">{currentStep.content}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-text-subtle">{stepIndex + 1} / {STEPS.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} aria-label="Previous step" disabled={stepIndex === 0} className="p-2 text-text-muted hover:text-white disabled:opacity-50"><ChevronLeft size={16} aria-hidden="true" /></button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-all shadow-sm shadow-primary/10"
            >
              {stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        <button onClick={onFinish} aria-label="Close tour" className="absolute top-2 right-2 p-1 text-text-subtle hover:text-white"><X size={14} aria-hidden="true" /></button>
      </div>
    </div>
  );
}