import React, { useEffect, useState } from "react";
import { IconMenu2, IconX, IconSun, IconMoonStars, IconBrandGithub } from "@tabler/icons-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "how it works", href: "#how-it-works" },
  { label: "features", href: "#features" },
  { label: "demo", href: "#demo" },
  { label: "docs", href: "#docs" },
];

const APPLE_FONT_STACK = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function NavLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: APPLE_FONT_STACK,
        fontSize: 13.5,
        fontWeight: 500,
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        transition: "color 0.14s ease",
      }}
    >
      {label}
    </a>
  );
}

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: "light" | "dark";
  onChange: (t: "light" | "dark") => void;
}) {
  const isDark = theme === "dark";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 28,
        borderRadius: 6,
        border: "1px solid var(--rule)",
        background: "transparent",
        overflow: "hidden",
        flexShrink: 0,
      }}
      role="radiogroup"
      aria-label="Theme toggle"
    >
      <button
        onClick={() => onChange("light")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          border: "none",
          background: isDark ? "transparent" : "var(--ink)",
          color: isDark ? "var(--mute)" : "var(--paper)",
          cursor: "pointer",
          transition: "all 0.14s ease",
        }}
        aria-label="Light mode"
      >
        <IconSun size={13} stroke={1.7} />
      </button>
      <button
        onClick={() => onChange("dark")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          border: "none",
          background: isDark ? "var(--ink)" : "transparent",
          color: isDark ? "var(--paper)" : "var(--mute)",
          cursor: "pointer",
          transition: "all 0.14s ease",
        }}
        aria-label="Dark mode"
      >
        <IconMoonStars size={13} stroke={1.7} />
      </button>
    </div>
  );
}

function GitHubButton() {
  return (
    <a
      href="https://github.com/sahil/byline"
      target="_blank"
      rel="noopener noreferrer"
      className="github-shutter-btn"
    >
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <IconBrandGithub size={14} stroke={1.6} />
        <span>Star on GitHub</span>
      </span>
    </a>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 74,
        left: 16,
        right: 16,
        transform: open ? "translateY(0)" : "translateY(-12px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease",
        willChange: "transform, opacity",
        zIndex: 60,
      }}
    >
      <div
        style={{
          borderRadius: 14,
          border: "0.5px solid var(--border)",
          background: "var(--bg-nav)",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: 16,
        }}
      >
        <div
          style={{
            fontFamily: APPLE_FONT_STACK,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            marginBottom: 12,
          }}
        >
          byline.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 8,
                textDecoration: "none",
                color: "var(--text-primary)",
                background: "transparent",
                fontFamily: APPLE_FONT_STACK,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <a
            href="https://github.com/sahil/byline"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="github-shutter-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              height: 38,
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            <div className="github-shutter-blades">
              <div className="github-shutter-blade" />
              <div className="github-shutter-blade" />
              <div className="github-shutter-blade" />
            </div>
            <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <IconBrandGithub size={14} stroke={1.6} />
              <span>Star on GitHub</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Read theme from document attributes (global theme)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return "dark";
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isCompact = false; // Set fallback structure

  return (
    <>
      <style>{`
        .dispatch-nav-shell {
          position: fixed;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 1000px;
          z-index: 50;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: top, width;
        }
        .dispatch-nav-shell.scrolled {
          top: 10px;
          width: min(680px, calc(100% - 32px));
        }
        .dispatch-nav {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          height: 52px;
          border-radius: 18px;
          border: 0.5px solid var(--border);
          background: var(--bg-nav);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(16px);
          WebkitBackdropFilter: blur(16px);
          transition: height 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s ease, border-radius 0.16s ease;
          will-change: height;
        }
        .dispatch-nav.scrolled {
          height: 44px;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.1);
        }
        .dispatch-nav-block {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }
        .dispatch-nav-block + .dispatch-nav-block {
          border-left: 0.5px solid var(--border);
        }
        .dispatch-nav-brand {
          font-family: ${APPLE_FONT_STACK};
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .dispatch-nav-links {
          justify-content: center;
          gap: 24px;
        }
        .dispatch-nav-right {
          justify-content: flex-end;
          gap: 12px;
        }
        .dispatch-nav-btn {
          display: inline-flex;
          align-items: center;
          height: 32px;
          padding: 0 12px;
          border-radius: 6px;
          border: 0.5px solid var(--border);
          text-decoration: none;
          color: var(--text-secondary);
          font-family: ${APPLE_FONT_STACK};
          font-size: 12.5px;
          background: transparent;
          transition: all 0.14s ease;
        }
        .dispatch-nav-btn:hover {
          color: var(--text-primary);
          background: var(--surface);
        }
        .dispatch-nav-mobile-trigger {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 0.5px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          transition: all 0.14s ease;
        }
        .dispatch-nav-mobile-trigger:hover {
          background: var(--surface);
        }
        .github-shutter-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 32px;
          padding: 0 12px;
          border-radius: 6px;
          border: 0.5px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          text-decoration: none;
          font-family: ${APPLE_FONT_STACK};
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: -0.015em;
          transition: border-color 0.16s ease, color 0.16s ease;
        }
        .github-shutter-btn:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
        }
        @media (max-width: 899px) {
          .dispatch-nav {
            grid-template-columns: auto 1fr auto;
            height: 48px;
          }
          .dispatch-nav-links,
          .dispatch-nav-desktop-only {
            display: none !important;
          }
          .dispatch-nav-mobile-trigger {
            display: inline-flex;
          }
          .dispatch-nav-shell {
            width: calc(100% - 20px);
            top: 10px;
          }
        }
      `}</style>

      <div className={`dispatch-nav-shell ${scrolled ? "scrolled" : ""}`}>
        <header className={`dispatch-nav ${scrolled ? "scrolled" : ""}`}>
          <div className="dispatch-nav-block dispatch-nav-brand" style={{ gap: 10 }}>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <Logo size={14} dark={false} />
            </a>
          </div>

          <nav className="dispatch-nav-block dispatch-nav-links">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </nav>

          <div className="dispatch-nav-block dispatch-nav-right">
            <div className="dispatch-nav-desktop-only">
              <GitHubButton />
            </div>
            <ThemeToggle theme={theme} onChange={setTheme} />
            <button
              className="dispatch-nav-mobile-trigger"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <IconX size={16} /> : <IconMenu2 size={16} />}
            </button>
          </div>
        </header>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
