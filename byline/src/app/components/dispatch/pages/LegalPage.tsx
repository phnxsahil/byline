import React from "react";

export function LegalPage({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <div style={{ padding: "80px 48px", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="ta-badge"><span style={{ color: "var(--accent)", marginRight: 8 }}>/</span> LEGAL</div>
      <h1 className="ta-hero-title" style={{ marginTop: 24, marginBottom: 48, fontSize: "3rem", textAlign: "center" }}>{title}</h1>
      
      <div style={{ width: "100%", maxWidth: 680, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        {content}
      </div>
    </div>
  );
}

export function PrivacyPolicyContent() {
  return (
    <>
      <p>Last updated: June 2026</p>
      
      <h2 style={{ color: "var(--text-primary)", fontSize: 20, fontFamily: "Space Grotesk", marginTop: 32, marginBottom: 16 }}>1. Data Collection</h2>
      <p>
        Byline (the open-source version) runs entirely on your own infrastructure. We do not collect, process, or store any of your data, milestones, or API keys when you self-host.
      </p>

      <h2 style={{ color: "var(--text-primary)", fontSize: 20, fontFamily: "Space Grotesk", marginTop: 32, marginBottom: 16 }}>2. LLM APIs</h2>
      <p>
        If you provide an Anthropic or OpenAI API key to the self-hosted engine, your data is sent directly to those providers. Please review their respective privacy policies regarding data retention and training.
      </p>

      <h2 style={{ color: "var(--text-primary)", fontSize: 20, fontFamily: "Space Grotesk", marginTop: 32, marginBottom: 16 }}>3. Telemetry</h2>
      <p>
        The open-source repository contains no analytics, telemetry, or tracking code. You have full visibility into the source code to verify this.
      </p>
    </>
  );
}

export function TermsOfServiceContent() {
  return (
    <>
      <p>Last updated: June 2026</p>
      
      <h2 style={{ color: "var(--text-primary)", fontSize: 20, fontFamily: "Space Grotesk", marginTop: 32, marginBottom: 16 }}>1. License to Use</h2>
      <p>
        Byline is distributed under the MIT License. You are free to use, modify, and distribute the software, provided you include the original copyright notice.
      </p>

      <h2 style={{ color: "var(--text-primary)", fontSize: 20, fontFamily: "Space Grotesk", marginTop: 32, marginBottom: 16 }}>2. No Warranty</h2>
      <p>
        The software is provided "as is", without warranty of any kind, express or implied. We are not liable for any API costs you incur, rate limits you hit, or any damage to your social media reputation caused by the automated agents.
      </p>

      <h2 style={{ color: "var(--text-primary)", fontSize: 20, fontFamily: "Space Grotesk", marginTop: 32, marginBottom: 16 }}>3. API Usage</h2>
      <p>
        You are responsible for securing your own API keys for LLMs and Composio. Do not commit these to public repositories.
      </p>
    </>
  );
}

export function MITLicenseContent() {
  return (
    <pre style={{ 
      fontFamily: "var(--byline-font-mono)", 
      fontSize: 13, 
      lineHeight: 1.6, 
      whiteSpace: "pre-wrap",
      background: "var(--bg-terminal)",
      padding: 24,
      border: "1px solid var(--border)",
      borderRadius: 6
    }}>
      {`MIT License

Copyright (c) 2026 Sahil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
    </pre>
  );
}
