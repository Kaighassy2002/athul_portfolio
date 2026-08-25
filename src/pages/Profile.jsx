import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { formatShortDate } from "../utils/editorial";
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
        d="M 36 118 C 160 118, 220 64, 340 72 S 520 128, 640 86"
      />
      <circle cx="36" cy="118" r="3.2" />
      <circle cx="340" cy="72" r="3.2" />
      <circle cx="640" cy="86" r="3.2" />
    </svg>
  );
}

export default function Profile() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const { user, stats, ready, logout } = useAuth();

  useEffect(() => {
    if (ready && !user) navigate("/login?from=/profile", { replace: true });
  }, [ready, user, navigate]);

  useEffect(() => {
    if (!user) return undefined;
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
  }, [user]);

  const onLogout = () => {
    logout();
    navigate("/blog");
  };

  return (
    <div className="passport-page" ref={pageRef}>
      <Header />
      <section className="notes-hero passport-hero">
        <div className="notes-grid" aria-hidden="true" />
        <div className="notes-paper" aria-hidden="true" />
        <span className="notes-mark notes-mark--tl">Plate 00</span>
        <span className="notes-mark notes-mark--tr">Reader</span>
        <span className="notes-mark notes-mark--bl">10.5276° N</span>
        <span className="notes-mark notes-mark--br">76.2144° E</span>
        <div className="notes-hero-copy">
          <p className="notes-kicker">00 — Passport</p>
          <div className="notes-title-wrap">
            <MapChart />
            <h1 className="notes-title">
              Your
              <em>plate</em>
            </h1>
          </div>
          <p className="notes-lede">
            A quiet record of how you have been reading the survey.
          </p>
        </div>
      </section>

      <main className="passport-main">
        {user && (
          <div className="passport-card passport-profile">
            <div className="passport-profile-head">
              <UserAvatar name={user.name} src={user.avatar} className="is-lg" />
              <div>
                <p className="notes-kicker">Reader</p>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <dl className="passport-profile-meta">
              <div>
                <dt>Filed</dt>
                <dd>{formatShortDate(user.createdAt)}</dd>
              </div>
              <div>
                <dt>Likes</dt>
                <dd>{String(stats?.likeCount ?? 0).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Notes</dt>
                <dd>{String(stats?.commentCount ?? 0).padStart(2, "0")}</dd>
              </div>
            </dl>
            <div className="passport-profile-actions">
              <Link to="/blog" className="notes-more-btn">
                Back to the survey
              </Link>
              <button type="button" className="plate-ghost-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
