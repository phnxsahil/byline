import React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function Navbar({ theme, onToggleTheme }: { theme: 'dark' | 'light', onToggleTheme: () => void }) {
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
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .ta-nav-link:hover {
          color: var(--text-primary);
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
          border: 1px solid var(--border);
          padding: 8px 16px;
          font-family: var(--byline-font-mono), monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ta-desk-btn:hover {
          background: var(--surface);
          border-color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .ta-nav-links {
            display: none;
          }
          .ta-navbar-inner {
            padding: 0 24px;
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
          <a href="#how-it-works" className="ta-nav-link">How it works</a>
          <a href="#features" className="ta-nav-link">Features</a>
          <a href="#demo" className="ta-nav-link">Demo</a>
          <a href="#docs" className="ta-nav-link">Docs</a>
        </div>

        {/* Right: Actions */}
        <div className="ta-nav-right">
          <button 
            onClick={onToggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>
          
          <button className="ta-desk-btn" onClick={() => window.location.hash = '#dashboard'}>
            Get the Desk
          </button>
        </div>
      </div>
    </nav>
  );
}
