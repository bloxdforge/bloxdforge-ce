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
  title: 'Terms of Service',
  description: 'BloxdForge Terms of Service - Review the terms and conditions governing your use of BloxdForge, a community-created utility tool for Bloxd.io.',
  alternates: {
    canonical: 'https://www.bloxdforge.com/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-text-subtle hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-text-muted mb-12">Last updated: September 19, 2026</p>
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using BloxdForge, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              BloxdForge is a community-created utility tool. We are not affiliated with, associated with, authorized by, endorsed by, or officially connected to Bloxd.io, or any of its subsidiaries or affiliates.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">User Conduct</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to use BloxdForge to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-2">
              <li>Create, use, or distribute malicious scripts, exploits, or hacks.</li>
              <li>Harass, abuse, threaten, or otherwise harm other users.</li>
              <li>Upload, publish, or distribute content that infringes the intellectual property rights of others.</li>
              <li>Attempt unauthorized access to systems, accounts, or data.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Content Ownership</h2>
            <p className="text-gray-300 leading-relaxed">
              Content you create using our tools (including texture packs and world edits) remains your property. By publishing content to the Workshop, you grant BloxdForge a non-exclusive license to host, display, and distribute that content within our platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the fullest extent permitted by applicable law, BloxdForge shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits, or business interruption, arising from or related to the use of (or inability to use) our website or services.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">AI Services</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Coding Assistant is powered by third-party AI providers via OpenRouter. The built-in models are
              BloxdForge Large (DeepSeek V4 Flash 0731), BloxdForge Base (Qwen3.8 27B), and BloxdForge Small
              (Nex-N2.5-Mini). For the Small model&apos;s provider, OpenRouter states: &quot;Logs: this provider may
              retain prompts, but does not use them for training.&quot; If you supply your own OpenRouter API key, you
              may use additional OpenRouter models at your own cost and risk. AI output may be inaccurate, so verify code
              before use. See our Privacy Policy for details on how AI requests are processed.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-4">Analytics & Data Processing</h2>
            <p className="text-gray-300 leading-relaxed">
              BloxdForge uses Umami Analytics to measure anonymous website usage. For BloxdForge, this analytics data is configured by us to be stored in the European Union (EU). By using the service, you acknowledge and accept this processing as described in our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}