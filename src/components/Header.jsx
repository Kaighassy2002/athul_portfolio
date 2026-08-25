import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { applyTheme, getStoredTheme } from "../utils/theme";
import { ROLE } from "./home/destinations";
import { warmAtlasAssets } from "./atlas/warmAtlas";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";

const rooms = [
  { to: "/atlas", index: "01", label: "Atlas" },
  { to: "/blog", index: "02", label: "Blog" },
  { to: "/scribble", index: "03", label: "Scribble" },
];

function BrandMark() {
  return (
    <svg className="site-brand-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M20 9.2 L30.4 31.2 h-4.4 l-1.7-4.3 H15.7 l-1.7 4.3 H9.6 Z M17.6 22.6 h4.8 L20 16.4 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Header() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" ? getStoredTheme() : "light"
  );
  const cinematic = pathname === "/" || pathname === "/atlas";
  const rawFrom = `${pathname}${search}`;
  const loginFrom = encodeURIComponent(
    pathname.startsWith("/login") || pathname.startsWith("/reset-password")
      ? "/blog"
      : rawFrom
  );

  const isActive = (path) => {
    if (path === "/atlas") {
      return pathname === "/" || pathname === "/atlas" || pathname.startsWith("/atlas/");
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const close = (event) => {
      if (!event.target.closest(".site-profile-wrap")) setProfileOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const toggleTheme = () => {
    setTheme((value) => (value === "dark" ? "light" : "dark"));
  };

  const onLogout = () => {
    logout();
    setOpen(false);
    setProfileOpen(false);
    if (pathname.startsWith("/profile") || pathname.startsWith("/login")) {
      navigate("/blog");
    }
  };

  const renderLoginLink = () => (
    <Link
      to={`/login?from=${loginFrom}`}
      className={`site-auth-link${pathname === "/login" ? " is-active" : ""}`}
      aria-label="Login"
      onClick={() => setOpen(false)}
    >
      <i className="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
      <span>Login</span>
    </Link>
  );

  return (
    <header
      className={[
        "site-header",
        cinematic ? "site-header--home" : "",
        open ? "is-open" : "",
        scrolled ? "is-scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="site-header-inner">
        <Link
          to="/"
          className={`site-brand${pathname === "/" ? " is-active" : ""}`}
          onClick={() => setOpen(false)}
        >
          <BrandMark />
          <span className="site-brand-text">
            <span className="site-brand-kicker">A quiet corner</span>
            <span className="site-brand-name">Athul</span>
            <span className="site-brand-role">{ROLE}</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {rooms.map((room) => (
            <Link
              key={room.to}
              to={room.to}
              className={`site-nav-link${isActive(room.to) ? " is-active" : ""}`}
              onPointerEnter={room.to === "/atlas" ? warmAtlasAssets : undefined}
            >
              <span className="site-nav-index">{room.index}</span>
              {room.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          {user ? (
            <div className="site-profile-wrap">
              <button
                type="button"
                className={`site-profile-chip${profileOpen ? " is-open" : ""}${
                  isActive("/profile") ? " is-active" : ""
                }`}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label={`${user.name} account menu`}
                onClick={() => setProfileOpen((value) => !value)}
              >
                <UserAvatar name={user.name} src={user.avatar} />
                <span>{user.name.split(" ")[0]}</span>
              </button>
              {profileOpen && (
                <div className="site-profile-menu" role="menu">
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button type="button" role="menuitem" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            renderLoginLink()
          )}
          <Link to="/contact" className="site-header-cta">
            Let&apos;s Connect
            <i className="fa-solid fa-paper-plane"></i>
          </Link>
          <button
            type="button"
            className="site-theme-toggle"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            <i className={theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          </button>
          <button
            type="button"
            className="site-nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
          </button>
        </div>
      </div>

      <nav id="site-nav-panel" className="site-nav-panel" aria-label="Mobile">
        <p className="site-nav-role">{ROLE}</p>
        {rooms.map((room) => (
          <Link
            key={room.to}
            to={room.to}
            className={`site-nav-link${isActive(room.to) ? " is-active" : ""}`}
          >
            <span>{room.label}</span>
            <span className="site-nav-index">{room.index}</span>
          </Link>
        ))}
        {!user && renderLoginLink()}
        <Link to="/contact" className="site-header-cta">
          Let&apos;s Connect
          <i className="fa-solid fa-paper-plane"></i>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
