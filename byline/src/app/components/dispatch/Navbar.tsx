import React, { useState } from "react";
import { IconMoon, IconSun, IconStar, IconX, IconMenu2 } from "@tabler/icons-react";

function ShutterNavLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="ta-nav-link"
      style={{ overflow: "hidden", height: "14px", display: "inline-flex" }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hov ? "translateY(-14px)" : "translateY(0)"
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", height: "14px" }}>
          {label}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", height: "14px", color: "var(--accent)" }}>
          {label}
        </span>
      </div>
    </a>
  );
}

export function Navbar({ theme, onToggleTheme }: { theme: 'dark' | 'light', onToggleTheme: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="ta-navbar">
      <style>{`
        .ta-navbar {
          width: 100%;
          height: 65px;
          border-bottom: 1px dashed var(--border);
          background: var(--bg);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .ta-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 48px;
          border-left: 1px dashed var(--border);
          border-right: 1px dashed var(--border);
          position: relative;
        }
        .ta-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .ta-nav-link {
          font-family: var(--byline-font-mono), monospace;
          font-size: 11px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: color 0.2s ease;
          font-weight: 700;
        }
        .ta-nav-link:hover {
          color: var(--accent);
        }
        .ta-nav-separator {
          color: var(--border);
          font-family: var(--byline-font-mono), monospace;
          font-size: 11px;
          margin: 0 4px;
        }
        .ta-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .ta-logo-b {
          font-family: var(--byline-font-mono), monospace;
          font-size: 16px;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ta-logo-bracket {
          color: var(--accent);
        }

        .ta-desk-btn {
          position: relative;
          background: transparent;
          color: var(--text-primary);
          border: 1px dashed var(--border);
          padding: 8px 16px;
          font-family: var(--byline-font-mono), monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ta-desk-btn:hover {
          border-color: var(--text-primary);
        }
        
        /* Using the global pixel button style for the main CTA */
        .nav-btn-pixel {
          padding: 8px 16px;
          font-size: 11px;
        }

        .ta-mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 4px;
        }

        .ta-mobile-dropdown {
          display: none;
          flex-direction: column;
          gap: 16px;
          padding: 24px;
          background: var(--bg2);
          border-bottom: 1px dashed var(--border);
          position: absolute;
          top: 65px;
          left: 0;
          right: 0;
          z-index: 99;
          transform: translateY(-100%);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          pointer-events: none;
        }
        .ta-mobile-dropdown.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        @media (max-width: 768px) {
          .ta-nav-links {
            display: none;
          }
          .ta-navbar-inner {
            padding: 0 24px;
          }
          .ta-mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-btn-pixel {
            display: none;
          }
          .ta-mobile-dropdown {
            display: flex;
          }
        }
      `}</style>
      
      <div className="ta-navbar-inner">
        {/* Left: Logo */}
        <a href="/" className="ta-logo-b">
          <span className="ta-logo-bracket">[</span>b<span className="ta-logo-bracket">]</span> byline
        </a>

        {/* Center: Nav links */}
        <div className="ta-nav-links">
          <ShutterNavLink href="#demo" label="Demo" />
          <span className="ta-nav-separator">//</span>
          <ShutterNavLink href="#how-it-works" label="How it works" />
          <span className="ta-nav-separator">//</span>
          <ShutterNavLink href="#features" label="Features" />
          <span className="ta-nav-separator">//</span>
          <ShutterNavLink href="#docs" label="Docs" />
        </div>

        {/* Right: Actions */}
        <div className="ta-nav-right">
          <button onClick={onToggleTheme} style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            borderRadius: "50%",
            transition: "background 0.2s ease, color 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(128, 128, 128, 0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
          >
            {theme === "dark" ? <IconSun size={18} stroke={2} /> : <IconMoon size={18} stroke={2} />}
          </button>

          <a href="https://github.com/phnxsahil/byline" target="_blank" rel="noopener noreferrer" className="ta-btn-pixel nav-btn-pixel dispatch-cta-pulse">
            <IconStar size={12} stroke={2.5} /> STAR ON GITHUB
          </a>
          
          <button className="ta-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Dropdown Menu */}
      <div className={`ta-mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        <div onClick={closeMenu}><ShutterNavLink href="#demo" label="Demo" /></div>
        <div onClick={closeMenu}><ShutterNavLink href="#how-it-works" label="How it works" /></div>
        <div onClick={closeMenu}><ShutterNavLink href="#features" label="Features" /></div>
        <div onClick={closeMenu}><ShutterNavLink href="#docs" label="Docs" /></div>
        <div style={{ marginTop: 8 }}>
          <a href="https://github.com/phnxsahil/byline" target="_blank" rel="noopener noreferrer" className="ta-btn-pixel" style={{ width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={closeMenu}>
            <IconStar size={12} stroke={2.5} /> STAR ON GITHUB
          </a>
        </div>
      </div>
    </nav>
  );
}
