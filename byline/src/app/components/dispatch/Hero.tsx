import React, { useState } from "react";
import {
  IconBrandGithub,
  IconBrandOpenSource,
  IconPlugConnected,
  IconRobot,
  IconTopologyStar3,
} from "@tabler/icons-react";

interface TermLine {
  type: "comment" | "prompt" | "arrow" | "success";
  text: string;
  gap?: number;
}

const LINES: TermLine[] = [
  { type: "comment", text: "# byline - log a milestone", gap: 14 },
  {
    type: "prompt",
    text: '$ byline log "shipped semantic search on fltrd.tech using pgvector"',
    gap: 14,
  },
  {
    type: "arrow",
    text: '-> Strategist: post-worthy - angle: "the caching problem nobody talks about"',
  },
  { type: "arrow", text: "-> Writing for: linkedin - x - r/webdev - threads", gap: 14 },
  { type: "success", text: "v 4 drafts ready - critic score 8.6/10 - awaiting review" },
];

const LINE_COLOR: Record<TermLine["type"], string> = {
  comment: "rgba(237, 234, 227, 0.66)",
  prompt: "var(--by-text)",
  arrow: "var(--by-text-2)",
  success: "var(--by-green)",
};

const TRUST = [
  { Icon: IconBrandOpenSource, label: "open source" },
  { Icon: IconRobot, label: "self-hostable" },
  { Icon: IconTopologyStar3, label: "langgraph + claude" },
  { Icon: IconPlugConnected, label: "composio" },
];

function EyebrowPill() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "5px 12px 5px 8px",
        border: "0.5px solid var(--border)",
        borderRadius: 999,
        background: "var(--surface)",
        boxShadow: "0 1px 0 var(--border) inset",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        🦉
      </span>
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: "var(--text-secondary)",
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        multi-agent content engine for builders who ship in public
      </span>
    </div>
  );
}

function CTAPrimary() {
  const [hov, setHov] = useState(false);

  return (
    <a
      href="#dashboard"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 176,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #F0A500 0%, #D4820C 100%)",
        color: "#000",
        borderRadius: 8,
        textDecoration: "none",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: hov ? "0 12px 28px rgba(240,165,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)" : "0 6px 16px rgba(240,165,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
        transition: "all 0.2s ease",
        transform: hov ? "scale(1.02)" : "scale(1)",
      }}
    >
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Try it now
      </span>
    </a>
  );
}

function CTAGhost() {
  return (
    <a
      href="https://github.com/sahil/byline"
      target="_blank"
      rel="noopener noreferrer"
      className="hero-github-shutter-btn"
    >
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
        <IconBrandGithub size={15} color="var(--text-primary)" stroke={1.7} />
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
          }}
        >
          Star on GitHub
        </span>
      </span>
    </a>
  );
}

function TerminalCard() {
  return (
    <div
      className="dispatch-hero-terminal"
      style={{
        backgroundColor: "var(--bg-terminal)",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {(["var(--by-text-3)", "var(--by-amber)", "var(--by-green)"] as const).map((c) => (
          <div
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: c,
              opacity: 0.92,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 10,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12,
            color: "rgba(237, 234, 227, 0.58)",
            letterSpacing: "0.03em",
          }}
        >
          byline - zsh
        </span>
      </div>

      <div
        style={{
          padding: "30px 28px 26px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100%",
        }}
      >
        <div>
          {LINES.map((line, i) => (
            <div
              key={i}
              className={`dispatch-term-line dispatch-term-line-${i}`}
              style={{ marginBottom: line.gap ?? 0 }}
            >
              <span
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 13,
                  lineHeight: 1.9,
                  color: LINE_COLOR[line.type],
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  display: "block",
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <div className="dispatch-term-cursor" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
            fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            $ byline
          </span>
          <span
            className="dispatch-cursor"
            style={{
              display: "inline-block",
              width: 7,
              height: 14,
              backgroundColor: "var(--by-accent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      style={{
        background: "var(--hero-bg)",
        paddingBottom: 110,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes dispatch-pulse {
          0% { box-shadow: 0 0 0 0 rgba(42, 179, 90, 0.42); }
          70% { box-shadow: 0 0 0 8px rgba(42, 179, 90, 0); }
          100% { box-shadow: 0 0 0 0 rgba(42, 179, 90, 0); }
        }
        .dispatch-pulse-dot {
          animation: dispatch-pulse 2.4s ease-out infinite;
        }
        @keyframes dispatch-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .dispatch-cursor {
          animation: dispatch-blink 1s step-end infinite;
        }
        .dispatch-hero-inner {
          padding-left: 40px;
          padding-right: 40px;
        }
        .dispatch-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(380px, 0.98fr);
          gap: 72px;
          align-items: center;
        }
        .dispatch-hero-terminal {
          aspect-ratio: 1.12 / 0.86;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 980px) {
          .dispatch-hero-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .dispatch-hero-terminal {
            max-width: 720px;
            margin: 0 auto;
          }
        }
        @media (max-width: 767px) {
          .dispatch-hero-inner {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }
          .dispatch-hero-terminal {
            aspect-ratio: auto !important;
            min-height: 320px;
          }
        }
        .hero-github-shutter-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 176px;
          height: 48px;
          border: 0.5px solid var(--border);
          border-radius: 8px;
          text-decoration: none;
          background: transparent;
          transition: border-color 0.16s ease;
        }
        .hero-github-shutter-btn:hover {
          border-color: var(--text-primary);
        }
      `}</style>

      <div
        className="dispatch-hero-inner"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          paddingTop: 136,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="dispatch-hero-grid">
          <div style={{ maxWidth: 620 }}>
            <div style={{ marginBottom: 22 }}>
              <EyebrowPill />
            </div>

            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 13,
                color: "rgba(237, 234, 227, 0.72)",
                letterSpacing: "0.05em",
                marginBottom: 28,
              }}
            >
              {"<>"} open source
            </div>

            <h1 style={{ margin: "0 0 24px", padding: 0, lineHeight: 0.94 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "Space Grotesk, Inter, sans-serif",
                  fontSize: "clamp(2.28rem, 4.8vw, 3.72rem)",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.07em",
                }}
              >
                Stop choosing between
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "Space Grotesk, Inter, sans-serif",
                  fontSize: "clamp(2.28rem, 4.8vw, 3.72rem)",
                  fontWeight: 700,
                  color: "var(--by-accent)",
                  letterSpacing: "-0.07em",
                }}
              >
                shipping the work
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "Space Grotesk, Inter, sans-serif",
                  fontSize: "clamp(2.28rem, 4.8vw, 3.72rem)",
                  fontWeight: 700,
                  color: "var(--by-accent)",
                  letterSpacing: "-0.07em",
                }}
              >
                and being seen for it.
              </span>
            </h1>

            <p
              style={{
                margin: "0 0 26px",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: "var(--text-secondary)",
                maxWidth: 620,
                lineHeight: 1.72,
              }}
            >
              One milestone. Five specialized AI agents run in parallel: a strategist, four platform
              writers, and a critic that keeps your voice intact before anything ships to LinkedIn, X,
              Reddit, or Threads.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 26,
                flexWrap: "wrap",
              }}
            >
              <CTAPrimary />
              <CTAGhost />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {TRUST.map(({ Icon, label }) => (
                <div
                  key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--text-secondary)",
                }}
              >
                <Icon size={15} stroke={1.5} />
                <span
                  style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      color: "var(--text-secondary)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <TerminalCard />
          </div>
        </div>
      </div>
    </section>
  );
}
