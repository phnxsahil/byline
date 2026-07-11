import React, { useState } from "react";
import { IconTerminal2, IconCopy, IconCheck } from "@tabler/icons-react";

export function SetupSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx byline init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="setup" className="ta-grid-wrapper dispatch-reveal">
      <div className="ta-grid">
        <div className="ta-col" style={{ gridColumn: 'span 4', padding: '120px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <div className="ta-badge" style={{ marginBottom: 24 }}>
            <span style={{ color: "var(--accent)", marginRight: 8 }}>/01</span> QUICK START
          </div>
          
          <h2 style={{ 
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", 
            fontSize: "clamp(2rem, 4vw, 3rem)", 
            fontWeight: 600, 
            lineHeight: 1.1,
            color: "var(--text-primary)",
            margin: "0 0 16px 0",
            letterSpacing: "-0.03em"
          }}>
            Drop it in your terminal.
          </h2>
          
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.6, margin: "0 0 48px 0", maxWidth: "500px" }}>
            Initialize the LangGraph pipeline instantly and spin up your local desk without paying a dime.
          </p>
          
          <div 
            onClick={handleCopy}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 24, 
              border: '1px dashed var(--border)', 
              padding: '16px 32px', 
              cursor: 'pointer',
              background: 'transparent',
              transition: 'border-color 0.2s, border-style 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text-primary)';
              e.currentTarget.style.borderStyle = 'solid';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.borderStyle = 'dashed';
            }}
          >
            <IconTerminal2 size={24} stroke={1.5} color="var(--text-secondary)" />
            <span style={{ fontFamily: 'var(--byline-font-mono), monospace', fontSize: 18, color: "var(--accent)", fontWeight: 600 }}>
               npx byline init
            </span>
            <div style={{ 
              marginLeft: 32, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              color: copied ? 'var(--text-primary)' : 'var(--text-secondary)', 
              fontFamily: 'var(--byline-font-mono), monospace', 
              fontSize: 12, 
              fontWeight: 700 
            }}>
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              {copied ? "COPIED" : "COPY"}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
