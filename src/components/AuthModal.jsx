import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import AuthPanel from "./AuthPanel";
import "../styles/auth.css";

export default function AuthModal() {
  const { authOpen, closeAuth, authMessage } = useAuth();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!authOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => {
      dialogRef.current?.querySelector("input, button")?.focus();
    }, 40);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [authOpen, closeAuth]);

  if (!authOpen) return null;

  return (
    <div className="passport-overlay" onClick={closeAuth}>
      <div
        className="passport-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="passport-dialog-title"
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="passport-dialog-grid" aria-hidden="true" />
        <span className="passport-dialog-mark passport-dialog-mark--tl">Plate 00</span>
        <span className="passport-dialog-mark passport-dialog-mark--tr">Reader</span>
        <button type="button" className="passport-close" onClick={closeAuth} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div id="passport-dialog-title">
          <AuthPanel variant="modal" message={authMessage} />
        </div>
      </div>
    </div>
  );
}
