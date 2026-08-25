import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthPanel from "../components/AuthPanel";
import { useAuth } from "../context/AuthContext";
import "../styles/blog.css";
import "../styles/auth.css";

function MapChart() {
  return (
    <svg className="notes-chart" viewBox="0 0 720 160" aria-hidden="true">
      {[28, 56, 84, 112, 140].map((y) => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} />
      ))}
      {[80, 180, 280, 380, 480, 580, 680].map((x) => (
        <line key={x} x1={x} y1="12" x2={x} y2="148" />
      ))}
      <path
        className="notes-chart-route"
        d="M 40 118 C 160 96, 240 48, 360 72 S 560 132, 690 58"
      />
      <circle cx="40" cy="118" r="3.2" />
      <circle cx="360" cy="72" r="3.2" />
      <circle cx="690" cy="58" r="3.2" />
    </svg>
  );
}

export default function Login() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { user, ready } = useAuth();
  const fromParam = params.get("from") || location.state?.from || "/blog";
  const from =
    typeof fromParam === "string" && fromParam.startsWith("/") && !fromParam.startsWith("//")
      ? fromParam
      : "/blog";

  useEffect(() => {
    if (ready && user) {
      navigate(from, { replace: true });
    }
  }, [ready, user, from, navigate]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          ".notes-kicker, .notes-title, .notes-lede, .notes-chart, .notes-mark, .passport-card",
          { clearProps: "all", opacity: 1 }
        );
        return;
      }
      gsap.fromTo(
        ".notes-kicker, .notes-title, .notes-lede",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
      gsap.fromTo(
        ".notes-chart, .notes-mark, .passport-card",
        { opacity: 0 },
        { opacity: 1, duration: 0.9, delay: 0.18, ease: "power2.out" }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="passport-page" ref={pageRef}>
      <Header />
      <section className="notes-hero passport-hero">
        <div className="notes-grid" aria-hidden="true" />
        <div className="notes-paper" aria-hidden="true" />
        <span className="notes-mark notes-mark--tl">Plate 00</span>
        <span className="notes-mark notes-mark--tr">Reader desk</span>
        <span className="notes-mark notes-mark--bl">10.5276° N</span>
        <span className="notes-mark notes-mark--br">76.2144° E</span>
        <div className="notes-hero-copy">
          <p className="notes-kicker">00 — Passport</p>
          <div className="notes-title-wrap">
            <MapChart />
            <h1 className="notes-title">
              Sign the
              <em>margin</em>
            </h1>
          </div>
          <p className="notes-lede">
            Login to like, comment, and pass a field note along. The plates stay
            readable either way.
          </p>
        </div>
      </section>

      <main className="passport-main">
        <div className="passport-card">
          <span className="passport-stamp" aria-hidden="true">
            Entry
          </span>
          <AuthPanel
            variant="page"
            initialMode={params.get("mode") === "signup" ? "signup" : "login"}
            onSuccess={() => navigate(from, { replace: true })}
          />
        </div>
        <p className="passport-footnote">
          <Link to="/blog">Back to the survey</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
