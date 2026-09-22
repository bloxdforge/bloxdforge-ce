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

import { useState, useEffect } from 'react';
import { lintCode, LintError } from '@/lib/bloxd-linter';
export function useBloxdLinter(code: string) {
  const [errors, setErrors] = useState<LintError[]>([]);
  useEffect(() => {
    const handler = setTimeout(() => {
      const newErrors = lintCode(code);
      setErrors(newErrors);
    }, 500);
    return () => clearTimeout(handler);
  }, [code]);
  return errors;
}