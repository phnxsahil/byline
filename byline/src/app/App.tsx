import React, { useEffect, useState } from "react";
import "./components/dispatch/animations.css";
import { Navbar } from "./components/dispatch/Navbar";
import { Hero } from "./components/dispatch/Hero";
import { ProblemSection } from "./components/dispatch/ProblemSection";
import { HowItWorksSection } from "./components/dispatch/HowItWorks";
import { FeatureSection } from "./components/dispatch/FeatureSection";
import { DemoSection } from "./components/dispatch/DemoSection";
import { IntegrationsSection } from "./components/dispatch/IntegrationsSection";
import { PricingSection } from "./components/dispatch/PricingSection";
import { CTASection } from "./components/dispatch/CTASection";
import { Footer } from "./components/dispatch/Footer";
import { DocsSection } from "./components/dispatch/DocsSection";
import { DashboardSection } from "./components/dispatch/DashboardSection";

function ShutterTransition({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      pointerEvents: "none",
    }}>
      <div className="shutter-blade" style={{ animationDelay: "0s" }} />
      <div className="shutter-blade" style={{ animationDelay: "0.06s" }} />
      <div className="shutter-blade" style={{ animationDelay: "0.12s" }} />
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<"landing" | "docs" | "dashboard">(
    window.location.hash.startsWith("#docs") ? "docs" :
    window.location.hash.startsWith("#dashboard") ? "dashboard" :
    "landing"
  );
  const [shutterActive, setShutterActive] = useState(false);
  const [shutterKey, setShutterKey] = useState(0);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const isDocs = window.location.hash.startsWith("#docs");
      const isDash = window.location.hash.startsWith("#dashboard");
      const targetView = isDocs ? "docs" : isDash ? "dashboard" : "landing";

      if (view === targetView) {
        if (!isDocs && !isDash && window.location.hash) {
          const id = window.location.hash.substring(1);
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
        return;
      }

      setShutterKey(k => k + 1);
      setShutterActive(true);

      const t1 = setTimeout(() => {
        setView(targetView);
        if (!isDocs && !isDash && window.location.hash) {
          setTimeout(() => {
            const id = window.location.hash.substring(1);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 50);
        } else {
          window.scrollTo(0, 0);
        }
      }, 350);

      const t2 = setTimeout(() => {
        setShutterActive(false);
      }, 920);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };
    window.addEventListener("hashchange", handleHashChange);
    // Initialize if needed
    const isDocs = window.location.hash.startsWith("#docs");
    const isDash = window.location.hash.startsWith("#dashboard");
    const initView = isDocs ? "docs" : isDash ? "dashboard" : "landing";
    if (view !== initView) {
      setView(initView);
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [view]);

  // Force dark mode on dashboard; Navbar owns theme for landing/docs views
  useEffect(() => {
    if (view === "dashboard") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, [view]);

  // ── Scroll-triggered reveals ──────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Unobserve after first reveal so it doesn't flicker on scroll-back
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe all section-reveal and bento-card targets
    document
      .querySelectorAll(".dispatch-reveal, .dispatch-bento-card")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [view]);

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
        /* ── Global editorial overrides ────────────────────────────────── */

        /* Warm body font */
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
          margin: 0;
        }

        /* Display headings use Space Grotesk */
        h1, h2, h3 {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          letter-spacing: -0.04em;
        }

        /* Monospace labels keep their stack */
        .dispatch-mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        /* ── TesterArmy Global Grid System ────────────────────────────── */
        .ta-grid-wrapper {
          width: 100%;
          border-bottom: 1px dashed var(--border);
          position: relative;
          background: var(--bg);
        }
        
        .ta-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          max-width: 1440px;
          margin: 0 auto;
          border-left: 1px dashed var(--border);
          border-right: 1px dashed var(--border);
          position: relative;
        }
        
        .ta-col {
          border-right: 1px dashed var(--border);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .ta-col:last-child {
          border-right: none;
        }

        /* Common Cross element for the grid */
        .ta-cross {
          position: absolute;
          width: 10px;
          height: 10px;
          color: var(--text-secondary);
          font-family: var(--byline-font-mono), monospace;
          font-size: 10px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 10;
          opacity: 0.5;
        }
        .ta-cross::after {
          content: "+";
        }

        /* Common section headers */
        .ta-hero-content {
          padding: 80px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100%;
        }
        .ta-badge {
          display: inline-flex;
          align-items: center;
          font-family: var(--byline-font-mono), monospace;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 0.08em;
          margin-bottom: 24px;
        }
        .ta-hero-title {
          font-family: "Space Grotesk", system-ui, sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          margin: 0 0 24px;
        }
        .ta-hero-desc {
          font-family: "Inter", system-ui, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 480px;
          margin: 0;
        }

        /* Global button pixel style */
        .ta-btn-pixel {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--accent);
          color: #000;
          font-family: var(--byline-font-mono), monospace;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.1s ease, background-color 0.2s ease;
        }
        .ta-btn-pixel:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .ta-btn-pixel::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 2px solid #000;
          pointer-events: none;
        }
        .ta-btn-pixel::after {
          content: "";
          position: absolute;
          bottom: -4px; right: -4px;
          width: 100%; height: 100%;
          background: #000;
          z-index: -1;
          transition: transform 0.1s ease;
        }
        .ta-btn-pixel:active::after {
          transform: translate(-2px, -2px);
        }

        @media (max-width: 1024px) {
          .ta-grid {
            grid-template-columns: 1fr;
          }
          .ta-col {
            border-right: none;
            border-bottom: 1px dashed var(--border);
          }
          .ta-col:last-child {
            border-bottom: none;
          }
        }

        @media (max-width: 767px) {
          .dispatch-main { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      {view !== "dashboard" && <Navbar theme={theme} onToggleTheme={handleToggleTheme} />}

      <main id="main-content">
        {view === "docs" ? (
          <DocsSection />
        ) : view === "dashboard" ? (
          <DashboardSection />
        ) : (
          <>
          {/* ── Hero ───────────────────────────────────────────────────────────── */}
          <Hero />

          {/* ── Problem ────────────────────────────────────────────────────────── */}
          <ProblemSection />

          {/* ── How it works ───────────────────────────────────────────────────── */}
          <HowItWorksSection />

          {/* ── Features ───────────────────────────────────────────────────────── */}
          <FeatureSection />

          {/* ── Demo ───────────────────────────────────────────────────────────── */}
          <DemoSection />

          {/* ── Integrations ───────────────────────────────────────────────────── */}
          <IntegrationsSection />

          {/* ── Social proof ───────────────────────────────────────────────────── */}
          {/* ── Pricing ────────────────────────────────────────────────────────── */}
          <PricingSection />

          {/* ── Final CTA ──────────────────────────────────────────────────────── */}
          <CTASection />

          {/* ── Footer ─────────────────────────────────────────────────────────── */}
          <Footer />
          </>
        )}
      </main>
      {/* ── Shutter Transition ── */}
      <ShutterTransition active={shutterActive} key={shutterKey} />
    </div>
  );
}
