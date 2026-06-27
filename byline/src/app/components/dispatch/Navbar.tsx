import React, { useEffect, useState } from "react";
import { IconBook2, IconMenu2, IconX, IconSun, IconMoonStars } from "@tabler/icons-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "how it works", href: "#how-it-works" },
  { label: "features", href: "#features" },
  { label: "demo", href: "#demo" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: hov ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        letterSpacing: "0.01em",
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

function DocsButton() {
  const [hov, setHov] = useState(false);

  return (
    <a
      href="#docs"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 34,
        padding: "0 12px",
        borderRadius: 6,
        border: "0.5px solid var(--border)",
        backgroundColor: hov ? "var(--surface)" : "transparent",
        color: "var(--text-primary)",
        textDecoration: "none",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.01em",
        transition: "all 0.16s ease",
      }}
    >
      <IconBook2 size={15} stroke={1.6} />
      <span>Read Docs</span>
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
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "var(--text-secondary)",
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
                  padding: "12px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  background: "transparent",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            <a
              href="#dashboard"
              onClick={onClose}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 38,
                borderRadius: 6,
                textDecoration: "none",
                border: "0.5px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12,
                background: "transparent",
              }}
            >
              open desk
            </a>
            <DocsButton />
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 900;
  });
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("byline-theme");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("byline-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsCompact(window.innerWidth < 900);
      if (window.innerWidth >= 900) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <style>{`
        .dispatch-nav-shell {
          position: fixed;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: min(1180px, calc(100% - 32px));
          z-index: 50;
          transition: top 0.16s cubic-bezier(0.16, 1, 0.3, 1), width 0.16s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: top, width;
        }
        .dispatch-nav-shell.scrolled {
          top: 10px;
          width: min(680px, calc(100% - 32px));
        }
        .dispatch-nav {
          height: 52px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          border-radius: 18px;
          border: 0.5px solid var(--border);
          background: var(--bg-nav);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: height 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s ease, border-radius 0.16s ease;
          will-change: height;
        }
        .dispatch-nav.scrolled {
          height: 44px;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.1);
          background: var(--bg-nav);
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
        .dispatch-nav-links {
          justify-content: center;
          gap: 22px;
          min-width: 0;
        }
        .dispatch-nav-right {
          gap: 10px;
          justify-content: flex-end;
        }
        .dispatch-nav-btn {
          display: inline-flex;
          align-items: center;
          height: 34px;
          padding: 0 12px;
          border-radius: 6px;
          border: 0.5px solid var(--border);
          text-decoration: none;
          color: var(--text-secondary);
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 12px;
          background: transparent;
          transition: all 0.14s ease;
        }
        .dispatch-nav-btn:hover {
          color: var(--text-primary);
          background: var(--surface);
        }
        .dispatch-nav-mobile-trigger {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          border: 0.5px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          transition: all 0.14s ease;
        }
        .dispatch-nav-mobile-trigger:hover {
          background: var(--surface);
        }
        @media (max-width: 899px) {
          .dispatch-nav {
            grid-template-columns: auto 1fr auto;
            height: 50px;
          }
          .dispatch-nav-brand {
            gap: 8px;
            min-width: 0;
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
        <header
          className={`dispatch-nav ${scrolled ? "scrolled" : ""}`}
          style={
            isCompact
              ? {
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: 12,
                  paddingRight: 12,
                  gap: 12,
                }
              : undefined
          }
        >
          {isCompact ? (
            <>
              <a
                href="#"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  flexShrink: 0,
                }}
              >
                byline.
              </a>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
                <ThemeToggle theme={theme} onChange={setTheme} />
                <button
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  className="dispatch-nav-mobile-trigger"
                  style={{ display: "inline-flex" }}
                >
                  {menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="dispatch-nav-block dispatch-nav-brand" style={{ gap: 10 }}>
                <a href="#" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                  <Logo size={15} dark={false} />
                </a>
              </div>

              <nav className="dispatch-nav-block dispatch-nav-links">
                {NAV_LINKS.map((link) => (
                  <NavLink key={link.label} {...link} />
                ))}
              </nav>

              <div className="dispatch-nav-block dispatch-nav-right">
                <a
                  href="#dashboard"
                  className="dispatch-nav-btn dispatch-nav-desktop-only"
                >
                  desk
                </a>
                <div className="dispatch-nav-desktop-only">
                  <DocsButton />
                </div>
                <ThemeToggle theme={theme} onChange={setTheme} />
                <button
                  className="dispatch-nav-mobile-trigger"
                  onClick={() => setMenuOpen((value) => !value)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                  {menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
                </button>
              </div>
            </>
          )}
        </header>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
