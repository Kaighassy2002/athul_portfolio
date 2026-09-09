import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { verifyEmail, resendVerification, user } = useAuth();
  const [status, setStatus] = useState(token ? "working" : "idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    verifyEmail({ token }).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setStatus("ok");
        navigate("/profile", { replace: true });
        return;
      }
      setStatus("error");
      setMessage(result.message);
    });
    return () => {
      cancelled = true;
    };
  }, [token, verifyEmail, navigate]);

  const onResend = async (event) => {
    event.preventDefault();
    setStatus("working");
    const result = await resendVerification({ email: email.trim() });
    setStatus("idle");
    setMessage(result.message || result.data?.message || "");
  };

  return (
    <div className="passport-page">
      <Header />
      <main className="passport-main passport-main--solo" id="main-content">
        <div className="passport-card">
          <p className="notes-kicker">Confirm</p>
          <h1 className="notes-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Verify your email
          </h1>
          {status === "working" ? <p className="passport-lede">Checking the letter…</p> : null}
          {message ? <p className="passport-notice">{message}</p> : null}
          {!token && (
            <form className="passport-form" onSubmit={onResend}>
              <label className="passport-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@somewhere.com"
                />
              </label>
              <button type="submit" className="passport-submit" disabled={status === "working"}>
                Send another letter
              </button>
            </form>
          )}
          <p className="passport-footnote">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
