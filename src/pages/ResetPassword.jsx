import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function ResetPassword() {
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { resetPassword, user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".passport-card, .notes-kicker, .notes-title", {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }
      gsap.fromTo(
        ".passport-card, .notes-kicker, .notes-title",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("Password should include a letter and a number, at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    if (!token) {
      setError("This reset link is missing.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await resetPassword({ token, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/profile", { replace: true });
  };

  return (
    <div className="passport-page" ref={pageRef}>
      <Header />
      <main className="passport-main passport-main--solo" id="main-content">
        <div className="passport-card">
          <p className="notes-kicker">Lost key</p>
          <h1 className="notes-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Set a new password
          </h1>
          <form className="passport-form" onSubmit={onSubmit}>
            <label className="passport-field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="8+ characters, letter and number"
                disabled={loading}
              />
            </label>
            <label className="passport-field">
              <span>Confirm</span>
              <input
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                placeholder="Repeat the password"
                disabled={loading}
              />
            </label>
            {error ? <p className="passport-error">{error}</p> : null}
            <button type="submit" className="passport-submit" disabled={loading}>
              {loading ? "Updating" : "Update password"}
            </button>
          </form>
          <p className="passport-footnote">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
