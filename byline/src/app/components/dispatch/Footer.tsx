import React, { useState } from "react";
import { IconArrowUpRight, IconBrandGithub, IconBrandX, IconSparkles } from "@tabler/icons-react";
import { Logo } from "./Logo";

interface Link { label: string; href: string }

const PRODUCT_LINKS: Link[] = [
  { label: "Docs", href: "#docs" },
  { label: "The Desk", href: "#dashboard" },
  { label: "Pricing", href: "#pricing" },
  { label: "GitHub", href: "https://github.com/sahil/byline" },
];

const SOCIAL_LINKS: Link[] = [
  { label: "GitHub", href: "https://github.com/sahil" },
  { label: "X",      href: "https://x.com/sahil" },
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
        textDecoration: "none",
        color: hov ? "var(--text-footer-primary)" : "var(--text-footer-secondary)",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        transition: "color 0.14s ease, transform 0.14s ease",
        transform: hov ? "translateX(4px)" : "translateX(0)",
      }}
    >
      <span>{label}</span>
      <IconArrowUpRight
        size={12}
        stroke={1.7}
        style={{
          opacity: hov ? 0.8 : 0.4,
          transition: "opacity 0.14s ease, transform 0.14s ease",
          transform: hov ? "translateX(2px) translateY(-2px)" : "translateX(0) translateY(0)",
        }}
      />
    </a>
  );
}

function LinkColumn({ title, links }: { title: string; links: Link[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          color: "var(--text-footer-secondary)",
          opacity: 0.45,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      {links.map((link) => (
        <FooterLink key={link.label} {...link} />
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        background: "var(--bg-footer)",
        borderTop: "0.5px solid var(--border-footer)",
        padding: "64px 0 0",
        overflow: "hidden",
      }}
    >
      <style>{`
        .byline-footer-shell {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
          position: relative;
          z-index: 1;
        }
        .byline-footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
        }
        .byline-footer-bottom {
          padding: 20px 0;
          border-top: 0.5px solid var(--border-footer);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        @keyframes byline-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @media (max-width: 767px) {
          .byline-footer-shell {
            padding: 0 20px;
          }
          .byline-footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding-bottom: 32px;
          }
          .byline-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding-bottom: 32px;
          }
        }
      `}</style>

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `
            linear-gradient(var(--border-footer) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-footer) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Gradient fade at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to bottom, var(--bg-footer), transparent)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Watermark glow */}
      <div
        style={{
          position: "absolute",
          right: "0%",
          top: "30%",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse at center, var(--text-footer-primary) 0%, transparent 70%)",
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "40%",
          transform: "translateY(-50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 200,
          fontWeight: 700,
          color: "var(--text-footer-primary)",
          opacity: 0.035,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          animation: "byline-float 8s ease-in-out infinite",
          textShadow: "0 0 80px var(--text-footer-primary), 0 0 160px var(--text-footer-primary)",
          zIndex: 0,
        }}
      >
        byline.
      </div>

      <div className="byline-footer-shell">
        <div className="byline-footer-grid">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 14 }}>
              <Logo size={22} />
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "Space Grotesk, Inter, sans-serif",
                fontSize: 17,
                fontWeight: 500,
                lineHeight: 1.45,
                color: "var(--text-footer-secondary)",
                maxWidth: 340,
                marginBottom: 20,
              }}
            >
              Built in public, for builders who build in public.
            </p>
            <a
              href="https://sharmasahil.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 12,
                color: "var(--text-footer-secondary)",
                opacity: 0.5,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                transition: "opacity 0.14s ease, transform 0.14s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              Built by Sahil · sharmasahil.me
              <IconArrowUpRight size={11} stroke={1.7} />
            </a>
          </div>

          <LinkColumn title="Product" links={PRODUCT_LINKS} />
          <LinkColumn title="Connect" links={SOCIAL_LINKS} />
        </div>

        <div className="byline-footer-bottom">
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--text-footer-secondary)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                opacity: 0.6,
              }}
            >
              <IconSparkles size={12} stroke={1.7} />
              MIT licensed
            </span>
            <a
              href="https://github.com/sahil/byline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                textDecoration: "none",
                color: "var(--text-footer-secondary)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                opacity: 0.6,
                transition: "opacity 0.14s ease, transform 0.14s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <IconBrandGithub size={12} stroke={1.7} />
              github.com/sahil/byline
            </a>
          </div>

          <div
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12,
              color: "var(--text-footer-secondary)",
              opacity: 0.45,
            }}
          >
            byline.so
          </div>
        </div>
      </div>
    </footer>
  );
}
