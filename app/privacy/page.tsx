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

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'BloxdForge Privacy Policy - Learn how we collect, use, and safeguard your information with a privacy-first, minimal-data approach.',
  alternates: {
    canonical: 'https://www.bloxdforge.com/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-text-subtle hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-text-muted mb-12">Last updated: September 19, 2026</p>
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy explains how BloxdForge collects, uses, and safeguards information when you access or use our website and services.
              We are committed to protecting your privacy and handling data responsibly. We may update this policy from time to time to reflect product, legal, or operational changes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Data Collection</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We collect limited information necessary to provide and improve our services:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2">
              <li>Browser local storage data to save your preferences (such as theme and settings) and project files.</li>
              <li>Temporary session data required for core site functionality.</li>
              <li>Anonymous usage metrics collected through Umami Analytics to improve performance and user experience.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Website Analytics</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use Umami Analytics, a privacy-focused analytics service, to measure anonymous website usage.
              BloxdForge&apos;s Umami analytics data is configured by us to be stored in the European Union (EU) and is fully compliant with GDPR and other privacy regulations.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2">
              <li>We do not use analytics data to personally identify users.</li>
              <li>We use aggregated analytics insights to understand traffic patterns and improve product quality.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">AI Services & Third-Party Processors</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              BloxdForge uses third-party Artificial Intelligence (AI) providers to power the Coding Assistant.
            </p>
            <h3 className="font-semibold text-white mb-2">OpenRouter & Dynamic Model Routing</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              Chat requests are processed by OpenRouter, an AI aggregation service. When you interact with AI features, your message content is sent to OpenRouter, which then routes it to various underlying model providers.
            </p>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              The specific model used may change based on availability and performance. We do not disclose the exact routing logic or downstream provider for every request.
              <a href="https://openrouter.ai/privacy" target="_blank" className="text-primary hover:underline ml-1">Read OpenRouter&apos;s Privacy Policy</a>.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 ml-2">
              <li><span className="font-medium text-white">BloxdForge Large</span>: uses Nex-N2.5-Pro. For this provider, OpenRouter states: &quot;Logs: this provider may retain prompts, but does not use them for training.&quot;</li>
              <li><span className="font-medium text-white">BloxdForge Base</span>: uses Qwen3.8 27B.</li>
              <li><span className="font-medium text-white">BloxdForge Small</span>: uses Nex-N2.5-Mini. For this provider, OpenRouter states: &quot;Logs: this provider may retain prompts, but does not use them for training.&quot;</li>
            </ul>
            <p className="text-sm text-text-muted leading-relaxed mt-4">
              If you supply your own OpenRouter API key (BYOK), you may additionally choose other OpenRouter models
              from the settings. Those requests are billed to your key and remain subject to OpenRouter&apos;s policies
              and the selected provider&apos;s data practices; check the provider&apos;s logging and training disclosures
              on its OpenRouter model page before sending sensitive content.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Local Storage & Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              BloxdForge uses browser Local Storage to save your projects, custom settings, and preferences directly on your device.
              We do not transmit your project files to our servers unless you explicitly choose to publish them to the Workshop.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our website may include links to external websites or integrations with third-party services (such as YouTube).
              If you access those services, their privacy practices apply, and BloxdForge is not responsible for data handling on external platforms.
            </p>
            <div className="bg-surface border border-surface-border p-4 rounded-lg mt-4">
              <p className="text-sm text-text-muted">
                <span className="text-primary font-bold">Note:</span> We do not sell, lease, or disclose your personal information to third parties unless you provide consent or disclosure is required by law.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}