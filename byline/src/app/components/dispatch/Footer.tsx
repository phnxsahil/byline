import React, { useState } from "react";
import { IconArrowUpRight, IconBrandGithub, IconBrandX, IconArrowUp, IconCode, IconTerminal2 } from "@tabler/icons-react";
import { StampBadge } from "./StampBadge";

const PRODUCT_LINKS = [
  { label: "AI Agents", href: "#how-it-works" },
  { label: "Content Pipeline", href: "#features" },
  { label: "The Desk", href: "#dashboard" },
  { label: "Pricing", href: "#pricing" },
];

const DEV_LINKS = [
  { label: "Documentation", href: "#docs" },
  { label: "API Reference", href: "#api" },
  { label: "GitHub Repo", href: "https://github.com/sahil/byline" },
  { label: "Self-Hosting", href: "#self-hosting" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "MIT License", href: "#license" },
];




function FooterLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        fontFamily: "var(--byline-font-body)",
        fontSize: 14,
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        marginBottom: 16,
        overflow: "hidden",
        height: "20px",
      }}
    >
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)", 
        transform: hov ? "translateY(-20px)" : "translateY(0)" 
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", height: "20px" }}>
          {label}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: "20px", color: "var(--text-primary)" }}>
          {label}
          <IconArrowUpRight size={14} stroke={1.5} color="var(--accent)" />
        </span>
      </div>
    </a>
  );
}

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: "var(--byline-font-mono)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-primary)",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "var(--accent)" }}>/</span>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {links.map((link) => (
          <FooterLink key={link.label} {...link} />
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer 
      style={{ 
        position: "relative", 
        borderTop: "none", 
        background: "var(--bg)", 
        overflow: "hidden"
      } as React.CSSProperties}
    >
      {/* Background Image & Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/footer_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        zIndex: 0,
        opacity: 0.85,
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, var(--bg) 0%, rgba(13,17,23,0.9) 25%, rgba(13,17,23,0.6) 65%, var(--bg) 90%)",
        zIndex: 0,
        pointerEvents: "none"
      }} />
      <style>{`
        /* Main Grid Architecture */
        .f-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          border-top: 1px solid var(--border);
        }

        /* Grid Intersection Crosses (Imperfection/Blueprint feel) */
        .f-cross {
          position: absolute;
          width: 10px;
          height: 10px;
          color: var(--text-secondary);
          font-family: var(--byline-font-mono);
          font-size: 10px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 10;
          opacity: 0.5;
        }

        .f-col {
          border-right: 1px solid var(--border);
          padding: 80px 48px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .f-col:last-child {
          border-right: none;
        }

        .f-brand-col {
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        /* Footer Mascot container styling is handled inside the component */

        .f-bottom-bar {
          border-top: 1px solid var(--border);
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          padding: 24px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .f-pixel-btn-override {
          padding: 12px 24px;
          font-size: 12px;
        }

        .f-socials {
          display: flex;
          gap: 16px;
        }
        .f-socials a {
          color: var(--text-secondary);
          transition: color 0.15s ease;
        }
        .f-socials a:hover {
          color: var(--text-primary);
        }

        .f-pixel-block {
          position: absolute;
          bottom: 48px;
          right: 48px;
          width: 56px;
          height: 40px;
          background: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--bg);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          clip-path: polygon(
            100% 0, 100% 100%, 0 100%, 0 50%, 25% 50%, 25% 25%, 50% 25%, 50% 0
          );
          z-index: 10;
        }
        .f-pixel-block:hover {
          background: var(--accent);
          color: #000;
          clip-path: polygon(
            100% 0, 100% 100%, 0 100%, 0 75%, 25% 75%, 25% 50%, 50% 50%, 50% 0
          );
        }

        @media (max-width: 1024px) {
          .f-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
          .f-brand-col {
            grid-column: span 3;
            border-right: none;
            border-bottom: 1px dashed var(--border);
          }
          .f-cross { display: none; }
        }
        @media (max-width: 768px) {
          .f-grid {
            grid-template-columns: 1fr;
          }
          .f-brand-col {
            grid-column: span 1;
          }
          .f-col {
            padding: 48px 32px;
            border-right: none;
            border-bottom: 1px dashed var(--border);
          }
          .f-col:last-child {
            border-bottom: none;
          }
          .f-bottom-bar {
            padding: 24px 32px;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
        }
      `}</style>

      <div className="dither-pattern" style={{ opacity: 0.08 }} />

      {/* SVG Stamp Background Watermark (Continuing from CTA Section) */}
      <div style={{ position: "absolute", top: -212, left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, width: "100%", height: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <StampBadge size={400} opacity={0.15} rotation={15} />
      </div>

      {/* Main Architectural Grid */}
      <div className="f-grid">
        {/* Intersection Markers (Desktop only) */}
        <div className="f-cross" style={{ top: 0, left: '50%' }}>+</div>
        <div className="f-cross" style={{ top: 0, left: '75%' }}>+</div>
        <div className="f-cross" style={{ bottom: 0, left: '50%' }}>+</div>
        <div className="f-cross" style={{ bottom: 0, left: '75%' }}>+</div>

        <div className="f-col f-brand-col">
          <div style={{ position: "relative", zIndex: 2 }}>
            <a href="#home" style={{
              fontFamily: "var(--byline-font-mono), monospace",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 32,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              display: "inline-block"
            }}>
              <span style={{ color: "var(--accent)" }}>[</span>b<span style={{ color: "var(--accent)" }}>]</span> byline
            </a>
            <p
              style={{
                fontFamily: "var(--byline-font-body)",
                fontSize: 16,
                lineHeight: 1.5,
                color: "var(--text-secondary)",
                maxWidth: 320,
                marginBottom: 32,
              }}
            >
              Ship your code. We'll orchestrate the content. A multi-agent engine for developers building in public.
            </p>
          </div>

          <div
            style={{
              fontFamily: "var(--byline-font-mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
              marginTop: 64,
              opacity: 0.8,
              position: "relative",
              zIndex: 2,
            }}
          >
            © {new Date().getFullYear()} BYLINE INC.
          </div>
        </div>

        <div className="f-col">
          <LinkColumn title="Product" links={PRODUCT_LINKS} />
        </div>
        <div className="f-col">
          <LinkColumn title="Developers" links={DEV_LINKS} />
        </div>
        <div className="f-col" style={{ position: "relative", paddingBottom: 80 }}>
          <LinkColumn title="Legal" links={LEGAL_LINKS} />

          {/* Blocky Back-To-Top Button */}
          <div 
            className="f-pixel-block"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
          >
            <IconArrowUp size={20} stroke={1.5} style={{ marginLeft: 8, marginTop: 8 }} />
          </div>
        </div>
      </div>

      {/* Bottom Status & Socials */}
      <div className="f-bottom-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--byline-font-mono)", fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
          <span>100% OPEN SOURCE. BUILT FOR DEVELOPERS WHO SHIP.</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span>MIT LICENSE</span>
        </div>

        <div className="f-socials">
          <a href="https://x.com/sahil"><IconBrandX size={18} stroke={1.5} /></a>
          <a href="https://github.com/sahil/byline"><IconBrandGithub size={18} stroke={1.5} /></a>
        </div>
      </div>
    </footer>
  );
}
