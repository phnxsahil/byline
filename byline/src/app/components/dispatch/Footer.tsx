import React, { useState } from "react";
import { IconArrowUpRight, IconBrandGithub, IconBrandX, IconArrowUp } from "@tabler/icons-react";

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
  { label: "Self-Hosting", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "MIT License", href: "#" },
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
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--byline-font-body)",
        fontSize: 14,
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        transition: "all 0.15s ease",
        marginBottom: 16,
        transform: hov ? "translateX(2px)" : "translateX(0)",
      }}
    >
      <span>{label}</span>
      <IconArrowUpRight
        size={14}
        stroke={1.5}
        style={{
          opacity: hov ? 1 : 0,
          transform: hov ? "translate(0, 0)" : "translate(-4px, 4px)",
          transition: "all 0.15s ease",
        }}
      />
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
        background: "var(--bg-footer)",
        borderTop: "1px dashed var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* Noise Overlay for Imperfection */
        .f-noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          z-index: 0;
        }

        /* Main Grid Architecture */
        .f-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          border-left: 1px dashed var(--border);
          border-right: 1px dashed var(--border);
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
          border-right: 1px dashed var(--border); /* Dashed lines for imperfection */
          padding: 64px 48px;
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

        /* Giant Faded Branding */
        .f-watermark {
          position: absolute;
          right: -40px;
          bottom: -60px;
          font-size: 380px;
          line-height: 1;
          opacity: 0.08;
          filter: grayscale(100%);
          transform: rotate(-12deg);
          pointer-events: none;
          userSelect: none;
          z-index: 0;
          /* Subtle glitch hover effect */
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        .f-brand-col:hover .f-watermark {
          transform: rotate(-8deg) scale(1.05);
          opacity: 0.12;
          filter: grayscale(0%); /* Brings back color on hover */
        }

        .f-bottom-bar {
          border-top: 1px dashed var(--border);
          border-left: 1px dashed var(--border);
          border-right: 1px dashed var(--border);
          padding: 24px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .f-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: var(--text-primary);
          color: var(--bg);
          font-family: var(--byline-font-body);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border-radius: var(--byline-radius-btn, 4px);
          transition: transform 0.15s ease, opacity 0.15s ease;
          position: relative;
          z-index: 2;
        }
        .f-cta-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
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

        /* Blocky 'Back to Top' Button */
        .f-pixel-block {
          position: absolute;
          bottom: 48px;
          right: 48px;
          width: 56px;
          height: 40px;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          clip-path: polygon(
            100% 0, 100% 100%, 0 100%, 0 50%, 25% 50%, 25% 25%, 50% 25%, 50% 0
          );
          z-index: 10;
        }
        .f-pixel-block:hover {
          background: var(--accent);
          color: #000;
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
        @media (max-width: 640px) {
          .f-grid {
            grid-template-columns: 1fr 1fr;
          }
          .f-col {
            padding: 40px 24px;
          }
          .f-bottom-bar {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }
        }
      `}</style>

      {/* Global Noise Overlay */}
      <div className="f-noise" />

      {/* Main Architectural Grid */}
      <div className="f-grid">
        
        {/* Intersection Markers (Desktop only) */}
        <div className="f-cross" style={{ top: 0, left: '50%' }}>+</div>
        <div className="f-cross" style={{ top: 0, left: '75%' }}>+</div>
        <div className="f-cross" style={{ bottom: 0, left: '50%' }}>+</div>
        <div className="f-cross" style={{ bottom: 0, left: '75%' }}>+</div>

        <div className="f-col f-brand-col">
          {/* Giant Watermark Mascot */}
          <div className="f-watermark">🦉</div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{
              fontFamily: "var(--byline-font-mono), monospace",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 32,
              letterSpacing: "-0.01em"
            }}>
              <span style={{ color: "var(--accent)" }}>[</span>b<span style={{ color: "var(--accent)" }}>]</span> byline
            </div>
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
            <a href="#dashboard" className="f-cta-btn">
              Get the Desk
            </a>
          </div>

          <div
            style={{
              fontFamily: "var(--byline-font-mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
              marginTop: 64,
              opacity: 0.5,
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--byline-font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>
          <div style={{ width: 6, height: 6, background: "#3FB950", boxShadow: "0 0 8px #3FB950" }} />
          SYSTEMS ONLINE
        </div>

        <div className="f-socials">
          <a href="https://x.com/sahil"><IconBrandX size={18} stroke={1.5} /></a>
          <a href="https://github.com/sahil/byline"><IconBrandGithub size={18} stroke={1.5} /></a>
        </div>
      </div>
    </footer>
  );
}
