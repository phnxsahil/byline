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
        color: hov ? "var(--by-text)" : "var(--by-text-2)",
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
        background:
          "linear-gradient(180deg, rgba(245,241,234,0) 0%, rgba(240,234,225,0.68) 14%, rgba(236,230,221,0.9) 100%)",
        padding: "32px 0 42px",
      }}
    >
      <style>{`
        .byline-footer-shell {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .byline-footer-card {
          border-radius: 28px;
          border: 0.5px solid rgba(17,17,17,0.08);
          background: rgba(250,247,241,0.82);
          box-shadow: 0 24px 44px rgba(17,17,17,0.05);
          overflow: hidden;
        }
        .byline-footer-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr);
        }
        .byline-footer-main,
        .byline-footer-side {
          padding: 28px 30px;
        }
        .byline-footer-side {
          border-left: 0.5px solid rgba(17,17,17,0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
          background: rgba(255,255,255,0.34);
        }
        .byline-footer-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
        }
        .byline-footer-links {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 18px;
          margin-top: 28px;
        }
        @media (max-width: 899px) {
          .byline-footer-shell {
            padding: 0 18px;
          }
          .byline-footer-grid {
            grid-template-columns: 1fr;
          }
          .byline-footer-side {
            border-left: none;
            border-top: 0.5px solid rgba(17,17,17,0.08);
          }
          .byline-footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="byline-footer-shell">
        <div className="byline-footer-card">
          <div className="byline-footer-grid">
            <div className="byline-footer-main">
              <div style={{ marginBottom: 18 }}>
                <Logo size={15} dark={false} />
              </div>

              <h2
                style={{
                  margin: 0,
                  fontFamily: "Space Grotesk, Inter, sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                  color: "var(--by-text)",
                  maxWidth: 700,
                }}
              >
                stop choosing between shipping the work and being seen for it.
              </h2>

              <p
                style={{
                  margin: "18px 0 0",
                  maxWidth: 640,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 15,
                  lineHeight: 1.72,
                  color: "var(--by-text-2)",
                }}
              >
                Byline watches the work, assembles the angle, drafts platform-native posts, and keeps the
                human review loop where it belongs: at your desk.
              </p>

              <div className="byline-footer-links">
                {LINKS.map((link) => (
                  <FooterLink key={link.label} {...link} />
                ))}
              </div>
            </div>

            <div className="byline-footer-side">
              <div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    color: "var(--by-text-2)",
                    letterSpacing: "0.08em",
                    marginBottom: 14,
                  }}
                >
                  product notes
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {[
                    "5 agents in the loop",
                    "4 publishing surfaces",
                    "0 lock-in if you want to self-host",
                  ].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--by-text-2)" }}>
                      <IconCircleDashedCheck size={15} stroke={1.6} />
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="byline-footer-meta">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.55)",
                      border: "0.5px solid rgba(17,17,17,0.08)",
                      color: "var(--by-text-2)",
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
                      padding: "8px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.55)",
                      border: "0.5px solid rgba(17,17,17,0.08)",
                      textDecoration: "none",
                      color: "var(--by-text-2)",
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
                    marginTop: 18,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "var(--by-text-2)",
                  }}
                >
                  Built in public by Sahil. Editorial control room for developer-founders who want the
                  output to sound like them, not like the model.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
