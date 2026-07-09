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
      <style>{`
        @keyframes shutterSlideIn {
          0% { transform: translateY(-100%); }
          40%, 60% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
        .shutter-blade {
          flex: 1;
          background: #0F0F0E;
          border-bottom: 0.5px solid var(--border);
          transform: translateY(-100%);
          animation: shutterSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform;
        }
      `}</style>
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

        @media (max-width: 767px) {
          .dispatch-main { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      {view !== "dashboard" && <Navbar />}

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
