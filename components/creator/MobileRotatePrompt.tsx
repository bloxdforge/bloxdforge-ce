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

import { Smartphone } from 'lucide-react';
export default function MobileRotatePrompt() {
    return (
        <div className="md:hidden fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-8 landscape:hidden">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6 border border-surface-border">
                <Smartphone className="w-8 h-8 text-primary -rotate-90" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Please Rotate Your Device</h2>
            <p className="text-text-muted">The Texture Studio is best experienced in landscape mode on mobile devices.</p>
        </div>
    );
}