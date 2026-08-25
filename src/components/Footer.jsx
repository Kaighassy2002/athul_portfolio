import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/footer.css";
import { DESTINATIONS, ROLE } from "./home/destinations";

const SOCIALS = [
  { href: "https://github.com/athulvingt", icon: "fa-github", label: "GitHub" },
  { href: "https://www.linkedin.com/in/athulsuresh96/", icon: "fa-linkedin", label: "LinkedIn" },
  { href: "https://instagram.com/", icon: "fa-instagram", label: "Instagram" },
];

function BrandMark() {
  return (
    <svg className="site-footer-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M20 9.2 L30.4 31.2 h-4.4 l-1.7-4.3 H15.7 l-1.7 4.3 H9.6 Z M17.6 22.6 h4.8 L20 16.4 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Footer() {
  const { pathname } = useLocation();
  const onHarbor = pathname === "/contact" || pathname.startsWith("/contact/");

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <p className="site-footer-kicker">The atlas</p>
            <Link to="/" className="site-footer-wordmark">
              <BrandMark />
              <span>
                <strong>Athul</strong>
                <em>{ROLE}</em>
              </span>
            </Link>
            <p className="site-footer-lede">
              A quiet corner from Thrissur for experiments, essays, and things
              still being figured out — mapped one destination at a time.
            </p>
          </div>

          <div>
            <p className="site-footer-kicker">Chapters</p>
            <ul className="site-footer-rooms">
              {DESTINATIONS.map((dest) => {
                const here =
                  pathname === dest.path || pathname.startsWith(`${dest.path}/`);
                return (
                  <li key={dest.id}>
                    <Link to={dest.path} className={here ? "is-here" : ""}>
                      <span className="site-footer-index">{dest.code}</span>
                      <span>
                        <strong>{dest.title}</strong>
                        <em>{here ? "You are here" : dest.copy}</em>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="site-footer-connect">
            <p className="site-footer-kicker">Harbor</p>
            {onHarbor ? (
              <a className="site-footer-cta" href="#contact-desk">
                Leave a note
                <i className="fa-solid fa-arrow-up"></i>
              </a>
            ) : (
              <Link to="/contact" className="site-footer-cta">
                Let&apos;s Connect
                <i className="fa-solid fa-paper-plane"></i>
              </Link>
            )}
            <div className="site-footer-social">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <i className={`fa-brands ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="site-footer-bar">
          <p>© {new Date().getFullYear()} Athul. All rights reserved.</p>
          <p>
            Made with <span aria-hidden="true">♥</span> by{" "}
            <a
              href="https://www.kaighassy.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kaighassy Suresh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
