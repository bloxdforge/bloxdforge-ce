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

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SettingsClient from './SettingsClient';
function SettingsPageFallback() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-text-subtle gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Loading Settings...</p>
        </div>
    );
}
export default function SettingsPage() {
    return (
        <Suspense fallback={<SettingsPageFallback />}>
            <SettingsClient />
        </Suspense>
    );
}