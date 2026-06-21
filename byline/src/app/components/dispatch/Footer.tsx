import React, { useState } from "react";
import { IconArrowUpRight, IconBrandGithub, IconCircleDashedCheck, IconSparkles } from "@tabler/icons-react";
import { Logo } from "./Logo";

const LINKS = [
  { label: "GitHub", href: "https://github.com/sahil/byline" },
  { label: "Docs", href: "#docs" },
  { label: "The Desk", href: "#dashboard" },
  { label: "Pricing", href: "#pricing" },
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
        gap: 8,
        textDecoration: "none",
        color: hov ? "var(--text-footer-primary)" : "var(--text-footer-secondary)",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        transition: "color 0.14s ease",
      }}
    >
      <span>{label}</span>
      <IconArrowUpRight size={14} stroke={1.7} />
    </a>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-footer)",
        borderTop: "0.5px solid var(--border-footer)",
        padding: "48px 0",
      }}
    >
      <style>{`
        .byline-footer-shell {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .byline-footer-card {
          border-radius: 20px;
          border: 0.5px solid var(--border-footer);
          background: var(--surface);
          box-shadow: 0 24px 44px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }
        .byline-footer-grid {
          display: flex;
          justify-content: space-between;
          padding: 40px;
          gap: 40px;
        }
        .byline-footer-brand {
          display: flex;
          flex-direction: column;
          max-width: 380px;
        }
        .byline-footer-links-col {
          display: flex;
          flex-direction: column;
        }
        .byline-footer-bottom {
          padding: 24px 40px;
          border-top: 0.5px solid var(--border-footer);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.01);
        }
        .byline-footer-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 767px) {
          .byline-footer-shell {
            padding: 0 16px;
          }
          .byline-footer-grid {
            flex-direction: column;
            padding: 24px;
            gap: 32px;
          }
          .byline-footer-bottom {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>

      <div className="byline-footer-shell">
        <div className="byline-footer-card">
          <div className="byline-footer-grid">
            <div className="byline-footer-brand">
              <div style={{ marginBottom: 16 }}>
                <Logo size={15} />
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Space Grotesk, Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: "var(--text-footer-secondary)",
                }}
              >
                Your byline. Everywhere you ship.
              </p>
            </div>

            <div className="byline-footer-links-col">
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-footer-secondary)",
                  opacity: 0.7,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Product
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LINKS.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </div>
          </div>

          <div className="byline-footer-bottom">
            <div className="byline-footer-meta">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.02)",
                  border: "0.5px solid var(--border-footer)",
                  color: "var(--text-footer-secondary)",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                }}
              >
                <IconSparkles size={13} stroke={1.7} />
                MIT licensed
              </span>
              <a
                href="https://github.com/sahil/byline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.02)",
                  border: "0.5px solid var(--border-footer)",
                  textDecoration: "none",
                  color: "var(--text-footer-secondary)",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                }}
              >
                <IconBrandGithub size={13} stroke={1.7} />
                github.com/sahil/byline
              </a>
            </div>

            <div
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                color: "var(--text-footer-secondary)",
              }}
            >
              Built in public by Sahil.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
