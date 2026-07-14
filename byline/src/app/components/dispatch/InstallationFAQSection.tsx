import React, { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

const faqs = [
  {
    q: "Do I need to pay for Byline?",
    a: "Byline is completely open-source and free to use. You only pay for your own API keys (OpenAI/Anthropic) if you host it yourself."
  },
  {
    q: "How does it connect to my GitHub?",
    a: "Byline uses GitHub webhooks or periodic polling to watch your repositories for meaningful commits and PRs."
  },
  {
    q: "Can I use it for multiple projects?",
    a: "Yes! You can configure multiple projects in your Byline dashboard, and each can have its own voice profile and tracking rules."
  },
  {
    q: "Which platforms are supported?",
    a: "Currently Byline drafts native content for LinkedIn, X (Twitter), Reddit, and Threads."
  }
];

export function InstallationFAQSection() {
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set([1]));

  const toggleFAQ = (idx: number) => {
    setOpenFAQs(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <section id="installation" className="ta-grid-wrapper dispatch-reveal">
      <style>{`
        .faq-item {
          border-bottom: 1px dashed var(--border);
          padding: 32px 24px;
          margin: 0 -24px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .faq-item:hover {
          background: color-mix(in srgb, var(--text-primary) 3%, transparent);
        }
        .faq-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 32px;
          bottom: 32px;
          width: 2px;
          background: var(--accent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .faq-item.open::before {
          opacity: 1;
        }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-family: "Bricolage Grotesque", system-ui, sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
        }
        .faq-answer {
          margin-top: 16px;
          padding-bottom: 8px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.6;
          display: none;
        }
        .faq-item.open .faq-answer {
          display: block;
        }
        .faq-item.open .faq-icon {
          transform: rotate(180deg);
        }
        .faq-icon {
          transition: transform 0.3s ease;
          color: var(--text-secondary);
        }
      `}</style>

      <div className="ta-grid">
        {/* Left half: Installation (2 columns) */}
        <div className="ta-col" style={{ gridColumn: "span 2" }}>
          <div className="ta-cross" style={{ bottom: -5, right: -5 }}></div>
          <div className="ta-cross" style={{ top: -5, right: -5 }}></div>
          <div style={{ height: "100%", padding: "64px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <div className="ta-badge" style={{ marginBottom: 16 }}>
              <span style={{ color: "var(--accent)", marginRight: 8 }}>/07</span>
              FAQ
            </div>
            
            <h2 style={{ 
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", 
              fontSize: "clamp(2.5rem, 5vw, 4rem)", 
              fontWeight: 600, 
              lineHeight: 1,
              color: "var(--text-primary)",
              margin: "0 0 16px 0",
              letterSpacing: "-0.04em"
            }}>
              Any Questions?
            </h2>
            
            <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.6, margin: 0, maxWidth: 400 }}>
              Everything you need to know about running the LangGraph pipeline, self-hosting, and the open-source MIT license.
            </p>
          </div>
        </div>

        {/* Right half: FAQs (2 columns) */}
        <div className="ta-col" style={{ gridColumn: "span 2", padding: "120px 64px" }}>
           <div style={{ 
            fontFamily: "var(--byline-font-mono), monospace", 
            fontSize: 12, 
            fontWeight: 600, 
            letterSpacing: "0.05em",
            color: "var(--text-secondary)",
            margin: "0 0 32px 0",
            textTransform: "uppercase"
          }}>
            Frequently Asked Questions
          </div>

          <div>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${openFAQs.has(idx) ? 'open' : ''}`}
                onClick={() => toggleFAQ(idx)}
              >
                <div className="faq-question">
                  {faq.q}
                  <IconChevronDown size={20} className="faq-icon" />
                </div>
                <div className="faq-answer">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
