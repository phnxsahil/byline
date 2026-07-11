import React, { useEffect, useState } from "react";
import "./components/dispatch/animations.css";
import { Navbar } from "./components/dispatch/Navbar";
import { Hero } from "./components/dispatch/Hero";
import { SetupSection } from "./components/dispatch/SetupSection";
import { ProblemSection } from "./components/dispatch/ProblemSection";
import { HowItWorksSection } from "./components/dispatch/HowItWorks";
import { FeatureSection } from "./components/dispatch/FeatureSection";
import { DemoSection } from "./components/dispatch/DemoSection";
import { IntegrationsSection } from "./components/dispatch/IntegrationsSection";
import { InstallationFAQSection } from "./components/dispatch/InstallationFAQSection";
import { CTASection } from "./components/dispatch/CTASection";
import { Footer } from "./components/dispatch/Footer";
import { DocsSection } from "./components/dispatch/DocsSection";
import { DashboardSection } from "./components/dispatch/DashboardSection";
import { PlaceholderPage } from "./components/dispatch/PlaceholderPage";
import { PricingPage } from "./components/dispatch/pages/PricingPage";
import { LegalPage, PrivacyPolicyContent, TermsOfServiceContent, MITLicenseContent } from "./components/dispatch/pages/LegalPage";
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
  const getRouteState = (hash: string) => {
    if (hash.startsWith("#docs")) return "docs";
    if (hash === "#api") return "docs"; // Redirect directly to docs
    if (hash === "#self-hosting") return "docs"; // Redirect directly to docs
    if (hash.startsWith("#dashboard")) return "dashboard";
    if (hash === "#pricing") return "pricing";
    if (hash === "#privacy") return "privacy";
    if (hash === "#terms") return "terms";
    if (hash === "#license") return "license";
    if (["#placeholder"].includes(hash)) return "placeholder";
    return "landing";
  };

  const getPlaceholderTitle = (hash: string) => {
    switch (hash) {
      case "#api": return "API Reference";
      case "#privacy": return "Privacy Policy";
      case "#terms": return "Terms of Service";
      case "#license": return "MIT License";
      case "#self-hosting": return "Self-Hosting Guide";
      case "#pricing": return "Pricing";
      default: return "Coming Soon";
    }
  };

  const [view, setView] = useState<"landing" | "docs" | "dashboard" | "placeholder">(getRouteState(window.location.hash));
  const [placeholderTitle, setPlaceholderTitle] = useState(getPlaceholderTitle(window.location.hash));
  const [shutterActive, setShutterActive] = useState(false);
  const [shutterKey, setShutterKey] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      const targetView = getRouteState(window.location.hash);
      const isScrollTarget = targetView === "landing" && window.location.hash && !["#", ""].includes(window.location.hash);

      if (view === targetView) {
        if (targetView === "placeholder") {
          setPlaceholderTitle(getPlaceholderTitle(window.location.hash));
          window.scrollTo(0, 0);
        } else if (isScrollTarget) {
          const id = window.location.hash.substring(1);
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
        return;
      }

      if (targetView === "placeholder") {
        setPlaceholderTitle(getPlaceholderTitle(window.location.hash));
      }

      setShutterKey(k => k + 1);
      setShutterActive(true);

      const t1 = setTimeout(() => {
        setView(targetView);
        if (targetView === "docs") {
          // If the user clicked a hash that we redirect to docs
          if (window.location.hash === "#api") {
            window.location.hash = "#docs/api";
          } else if (window.location.hash === "#self-hosting") {
            window.location.hash = "#docs/self-host";
          }
        }
        
        if (isScrollTarget) {
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
    const initView = getRouteState(window.location.hash);
    if (view !== initView) {
      setView(initView);
      if (initView === "placeholder") setPlaceholderTitle(getPlaceholderTitle(window.location.hash));
    }
    
    // Redirect logic on init
    if (window.location.hash === "#api") window.location.hash = "#docs/api";
    if (window.location.hash === "#self-hosting") window.location.hash = "#docs/self-host";
    return () => window.removeEventListener("hashchange", handleHashChange);
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
      .querySelectorAll(".dispatch-reveal, .dispatch-bento-card, .ta-grid-wrapper")
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

        html {
          scroll-behavior: smooth;
        }

        ::selection {
          background-color: var(--accent);
          color: #000;
        }

        /* Warm body font */
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text-primary);
          margin: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, h2, h3 {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
          letter-spacing: -0.04em;
        }

        /* Monospace labels keep their stack */
        .dispatch-mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        /* ── TesterArmy Global Grid System ────────────────────────────── */
        .ta-grid-wrapper {
          width: 100%;
          position: relative;
          background: var(--bg);
          z-index: 1;
          border-bottom: 1px solid var(--border);
          border-top: 1px solid var(--border);
          margin-bottom: 32px;
          scroll-margin-top: 65px;
          
          /* Simpler, faster reveal animation */
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        
        .ta-grid-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Subtle structural joint marker in the 32px gap */
        .ta-grid-wrapper:not(:last-child)::after {
          content: "+";
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          color: var(--border);
          line-height: 1;
          pointer-events: none;
        }

        
        .ta-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          max-width: 1440px;
          margin: 0 auto;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          position: relative;
        }
        
        .ta-col {
          border-right: 1px solid var(--border);
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
          font-family: "Bricolage Grotesque", system-ui, sans-serif;
          font-size: clamp(4rem, 8vw, 7rem);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.05em;
          color: var(--text-primary);
          margin: 0 0 32px;
          text-wrap: balance;
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
          border: 2px solid #000;
          cursor: pointer;
          overflow: hidden;
          z-index: 1;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          clip-path: polygon(
            0 8px, 8px 8px, 8px 0, 
            calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 
            100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 
            8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px)
          );
          box-shadow: 4px 4px 0 0 #000;
        }
        .ta-btn-pixel:hover {
          transform: translateY(-2px);
          box-shadow: 6px 6px 0 0 #000;
        }
        .ta-btn-pixel:active {
          transform: translateY(2px);
          box-shadow: 2px 2px 0 0 #000;
        }

        .ta-btn-pixel-secondary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          color: var(--text-secondary);
          font-family: var(--byline-font-mono), monospace;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid var(--border);
          cursor: pointer;
          overflow: hidden;
          z-index: 1;
          transition: transform 0.15s ease, box-shadow 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          clip-path: polygon(
            0 8px, 8px 8px, 8px 0, 
            calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 
            100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 
            8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px)
          );
        }
        .ta-btn-pixel-secondary::before {
          content: "";
          position: absolute;
          top: 0; left: -101%;
          width: 101%; height: 100%;
          background-color: var(--text-primary);
          z-index: -1;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ta-btn-pixel-secondary:hover {
          color: var(--bg);
          border-color: var(--text-primary);
          transform: translateY(-2px);
          box-shadow: 6px 6px 0 0 rgba(255, 255, 255, 0.15);
        }
        .ta-btn-pixel-secondary:hover::before {
          transform: translateX(100%);
        }
        .ta-btn-pixel-secondary:active {
          transform: translateY(2px);
          box-shadow: 2px 2px 0 0 rgba(240, 165, 0, 0.15);
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
      {view !== "dashboard" && <Navbar />}

      <main id="main-content">
        {view === "docs" ? (
          <DocsSection />
        ) : view === "dashboard" ? (
          <DashboardSection />
        ) : view === "placeholder" ? (
          <>
            <PlaceholderPage title={placeholderTitle} />
            <Footer />
          </>
        ) : view === "pricing" ? (
          <>
            <PricingPage />
            <Footer />
          </>
        ) : view === "privacy" ? (
          <>
            <LegalPage title="Privacy Policy" content={<PrivacyPolicyContent />} />
            <Footer />
          </>
        ) : view === "terms" ? (
          <>
            <LegalPage title="Terms of Service" content={<TermsOfServiceContent />} />
            <Footer />
          </>
        ) : view === "license" ? (
          <>
            <LegalPage title="MIT License" content={<MITLicenseContent />} />
            <Footer />
          </>
        ) : (
          <>
          {/* ── Hero ───────────────────────────────────────────────────────────── */}
          <Hero />

          {/* ── Quick Setup ────────────────────────────────────────────────────── */}
          <SetupSection />

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
          {/* ── Installation & FAQ ─────────────────────────────────────────────── */}
          <InstallationFAQSection />

          {/* ── Final CTA & Footer ─────────────────────────────────────────────── */}
          <div style={{ position: "relative", marginTop: 32 }}>
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/cta_typewriter_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              zIndex: 0,
              opacity: 0.85
            }} />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, var(--bg) 0%, rgba(13,17,23,0.1) 40%, rgba(13,17,23,0.3) 70%, var(--bg) 100%)",
              zIndex: 0
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <CTASection />
              <Footer />
            </div>
          </div>
          </>
        )}
      </main>
      {/* ── Shutter Transition ── */}
      <ShutterTransition active={shutterActive} key={shutterKey} />
    </div>
  );
}
