import React from "react";
import { IconBrandLinkedin, IconBrandX, IconBrandReddit } from "@tabler/icons-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  quote:      string;
  name:       string;
  role:       string;
  handle:     string;
  initials:   string;
  avatarBg:   string;
  platform:   string;
  platformBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "First tool that actually remembers what fltrd.tech is. I stopped re-explaining my own project in every prompt.",
    name:       "Rohan K.",
    role:       "founder",
    handle:     "@rohan_builds",
    initials:   "RK",
    avatarBg:   "#6366F1",
    platform:   "in",
    platformBg: "#0A66C2",
  },
  {
    quote:
      "The Reddit writer saved me. My first three posts got removed for promo. Byline reframed them as problem posts and they actually got upvoted.",
    name:       "Meera S.",
    role:       "indie hacker",
    handle:     "@meeraships",
    initials:   "MS",
    avatarBg:   "#0D9488",
    platform:   "r/",
    platformBg: "#FF4500",
  },
  {
    quote:
      "The critic agent flagged 'excited to announce' in my own draft. Earned my trust immediately.",
    name:       "Dev P.",
    role:       "student-founder",
    handle:     "@devbuilds",
    initials:   "DP",
    avatarBg:   "#7C3AED",
    platform:   "X",
    platformBg: "#0F0F0D",
  },
];

// ─── Testimonial card ─────────────────────────────────────────────────────────

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: 12,
        padding: "20px 20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        border: "0.5px solid var(--border)",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Accent line */}
      <div
        style={{
          width: 32,
          height: 2,
          backgroundColor: "#E85E2C",
          borderRadius: 1,
          marginBottom: 16,
          flexShrink: 0,
        }}
      />

      {/* Quote */}
      <p
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 400,
          color: "var(--text-primary)",
          lineHeight: 1.6,
          margin: "0 0 20px",
          flex: 1,
          transition: "color 0.2s ease",
        }}
      >
        "{t.quote}"
      </p>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: t.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#F5F2EC",
              letterSpacing: "0.01em",
            }}
          >
            {t.initials}
          </span>
        </div>

        {/* Name + role + handle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "color 0.2s ease",
            }}
          >
            {t.name}
            <span
              style={{
                fontWeight: 400,
                color: "var(--text-secondary)",
                marginLeft: 5,
                transition: "color 0.2s ease",
              }}
            >
              · {t.role}
            </span>
          </div>
          <div
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.4,
              marginTop: 2,
              transition: "color 0.2s ease",
            }}
          >
            {t.handle}
          </div>
        </div>

        {/* Platform badge — rendered as SVG Brand Icon */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 5,
            backgroundColor: t.platformBg,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {t.platform === "in" && <IconBrandLinkedin size={13} stroke={2} />}
          {t.platform === "X" && <IconBrandX size={11} stroke={2.5} />}
          {t.platform === "r/" && <IconBrandReddit size={13} stroke={2} />}
        </span>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function SocialProofSection() {
  return (
    <section className="dispatch-reveal" style={{ backgroundColor: "var(--bg)" }}>
      <style>{`
        .dispatch-proof-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding-left: 40px;
          padding-right: 40px;
          padding-bottom: 140px;
        }
        .dispatch-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        @media (max-width: 767px) {
          .dispatch-proof-inner {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .dispatch-proof-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="dispatch-proof-inner">

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 10,
            fontWeight: 400,
            color: "var(--text-secondary)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          PEOPLE WHO ACTUALLY SHIP, TALKING.
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "Space Grotesk, system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            margin: "0 0 36px",
            padding: 0,
            transition: "color 0.3s ease",
          }}
        >
          For builders who build in public.
        </h2>

        {/* Cards */}
        <div className="dispatch-proof-grid">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.handle} t={t} />
          ))}
        </div>

      </div>
    </section>
  );
}
