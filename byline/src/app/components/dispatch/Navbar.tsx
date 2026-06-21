import React, { useEffect, useState } from "react";
import { IconBook2, IconMenu2, IconX, IconSun, IconMoon } from "@tabler/icons-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "demo", href: "#demo" },
  { label: "features", href: "#features" },
  { label: "docs", href: "#docs" },
  { label: "pricing", href: "#pricing" },
  { label: "github", href: "https://github.com/sahil/byline" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        fontWeight: 400,
        color: hov ? "var(--by-text)" : "var(--by-text-2)",
        textDecoration: "none",
        letterSpacing: "0.02em",
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
  const [hov, setHov] = useState(false);
  const isDarkTheme = theme === "dark";

  return (
    <button
      onClick={() => onChange(isDarkTheme ? "light" : "dark")}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 10,
        border: "0.5px solid var(--by-border)",
        background: hov ? "rgba(255,255,255,0.08)" : "transparent",
        cursor: "pointer",
        transition: "all 0.14s ease",
        color: "var(--by-text-2)",
        flexShrink: 0,
      }}
      title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDarkTheme ? <IconSun size={17} stroke={1.7} /> : <IconMoon size={17} stroke={1.7} />}
    </button>
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
        height: 38,
        padding: "0 16px",
        borderRadius: 10,
        border: "0.5px solid var(--by-border)",
        backgroundColor: hov ? "var(--by-bg-3)" : "var(--by-bg-2)",
        color: "var(--by-text)",
        textDecoration: "none",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.02em",
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
        transform: open ? "translateY(0)" : "translateY(-10px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "transform 0.18s ease, opacity 0.18s ease",
        zIndex: 60,
      }}
    >
      <div
        style={{
          borderRadius: 22,
          border: "0.5px solid var(--by-border)",
          background: "rgba(22, 21, 20, 0.95)",
          boxShadow: "0 24px 54px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          padding: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.07em",
            color: "var(--by-text-2)",
            marginBottom: 12,
          }}
        >
          editorial control room
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
                padding: "14px 12px",
                borderRadius: 14,
                textDecoration: "none",
                color: "var(--by-text)",
                background: "rgba(255,255,255,0.03)",
                fontFamily: "'Inter', system-ui, sans-serif",
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
              height: 42,
              borderRadius: 14,
              textDecoration: "none",
              border: "0.5px solid var(--by-border)",
              color: "var(--by-text)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              background: "rgba(255,255,255,0.03)",
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
        }
        .dispatch-nav {
          height: 52px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          border-radius: 18px;
          border: 0.5px solid var(--by-border);
          background: rgba(22, 21, 20, 0.82);
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition: box-shadow 0.18s ease, transform 0.18s ease, background-color 0.18s ease;
        }
        .dispatch-nav.scrolled {
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
          background: rgba(12, 12, 10, 0.92);
        }
        .dispatch-nav-block {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }
        .dispatch-nav-block + .dispatch-nav-block {
          border-left: 0.5px solid var(--by-border);
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
          height: 38px;
          padding: 0 14px;
          border-radius: 10px;
          border: 0.5px solid var(--by-border);
          text-decoration: none;
          color: var(--by-text-2);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          background: rgba(255,255,255,0.03);
          transition: all 0.14s ease;
        }
        .dispatch-nav-btn:hover {
          color: var(--by-text);
          background: rgba(255,255,255,0.08);
          border-color: rgba(235, 230, 220, 0.15);
        }
        .dispatch-nav-mobile-trigger {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 0.5px solid var(--by-border);
          background: rgba(255,255,255,0.03);
          color: var(--by-text);
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          transition: all 0.14s ease;
        }
        .dispatch-nav-mobile-trigger:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(235, 230, 220, 0.15);
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

      <div className="dispatch-nav-shell">
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
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--by-text)",
                  letterSpacing: "-0.03em",
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
