import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let gisPromise;

function loadGoogleIdentity() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-gis='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.gis = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google failed to load"));
    document.head.appendChild(script);
  });
  return gisPromise;
}

function Field({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  disabled,
}) {
  return (
    <label className={`passport-field${error ? " has-error" : ""}`}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
      />
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function titlesFor(mode, message) {
  if (message) {
    return {
      kicker: "Passport",
      title: message,
      lede:
        mode === "signup"
          ? "Create an account to leave a mark on this note."
          : "A short stop at the desk, then back to the plate.",
    };
  }
  if (mode === "signup") {
    return {
      kicker: "New reader",
      title: "Create an account",
      lede: "A name, a return address, and a password. That is the whole passport.",
    };
  }
  if (mode === "forgot") {
    return {
      kicker: "Lost key",
      title: "Reset the password",
      lede: "If the address is on the survey, a reset letter will be sent.",
    };
  }
  return {
    kicker: "Welcome back",
    title: "Login",
    lede: "Email and password, or continue with Google.",
  };
}

export default function AuthPanel({
  variant = "page",
  initialMode = "login",
  message = "",
  onSuccess,
}) {
  const {
    login,
    signup,
    loginWithGoogle,
    forgotPassword,
    googleClientId,
    googleEnabled,
    authMode,
    setAuthMode,
  } = useAuth();

  const mode = variant === "modal" ? authMode : undefined;
  const [pageMode, setPageMode] = useState(initialMode);
  const activeMode = mode || pageMode;
  const setMode = variant === "modal" ? setAuthMode : setPageMode;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const googleClientRef = useRef(null);

  useEffect(() => {
    setPageMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setFormError("");
    setErrors({});
    setNotice("");
  }, [activeMode]);

  const copy = titlesFor(activeMode, message);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const validate = () => {
    const next = {};
    if (activeMode === "signup" && form.name.trim().length < 2) {
      next.name = "Please add your name.";
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      next.email = "Please use a valid email.";
    }
    if (activeMode !== "forgot" && form.password.length < 8) {
      next.password = "At least 8 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finish = (result) => {
    if (!result.ok) {
      setFormError(result.message);
      if (result.code === "USE_GOOGLE") setMode("login");
      return false;
    }
    onSuccess?.(result.data.user);
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFormError("");
    setNotice("");
    setDevResetUrl("");

    try {
      if (activeMode === "forgot") {
        const result = await forgotPassword({ email: form.email.trim() });
        if (!result.ok) {
          setFormError(result.message);
          return;
        }
        setNotice(result.data.message);
        if (result.data.devResetUrl) setDevResetUrl(result.data.devResetUrl);
        return;
      }

      if (activeMode === "signup") {
        finish(
          await signup({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          })
        );
        return;
      }

      finish(
        await login({
          email: form.email.trim(),
          password: form.password,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    if (!googleEnabled) {
      setFormError("Google login is not configured yet.");
      return;
    }
    setFormError("");
    try {
      await loadGoogleIdentity();
      if (!window.google?.accounts?.oauth2) {
        throw new Error("Google is unavailable.");
      }
      if (!googleClientRef.current) {
        googleClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "openid email profile",
          callback: async (response) => {
            if (response.error) {
              setFormError("Google login was cancelled.");
              setLoading(false);
              return;
            }
            setLoading(true);
            try {
              const result = await loginWithGoogle({
                accessToken: response.access_token,
              });
              finish(result);
            } finally {
              setLoading(false);
            }
          },
        });
      }
      googleClientRef.current.requestAccessToken({ prompt: "select_account" });
    } catch {
      setFormError("Google login could not start.");
      setLoading(false);
    }
  };

  return (
    <div className={`passport-panel passport-panel--${variant}`}>
      <p className="passport-kicker">{copy.kicker}</p>
      <h2 className={variant === "modal" ? "passport-modal-title" : "passport-title"}>
        {copy.title}
      </h2>
      <p className="passport-lede">{copy.lede}</p>

      {activeMode !== "forgot" && (
        <>
          <button
            type="button"
            className="passport-google"
            onClick={onGoogle}
            disabled={loading}
          >
            <span className="passport-google-mark" aria-hidden="true">
              G
            </span>
            Continue with Google
          </button>
          <p className="passport-or">or with email</p>
        </>
      )}

      <form className="passport-form" onSubmit={onSubmit} noValidate>
        {activeMode === "signup" && (
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={onChange}
            error={errors.name}
            autoComplete="name"
            placeholder="How should we address you?"
            disabled={loading}
          />
        )}
        <Field
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          error={errors.email}
          autoComplete="email"
          placeholder="you@somewhere.com"
          disabled={loading}
        />
        {activeMode !== "forgot" && (
          <label className={`passport-field${errors.password ? " has-error" : ""}`}>
            <span>Password</span>
            <span className="passport-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                autoComplete={activeMode === "signup" ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
                disabled={loading}
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                className="passport-eye"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </span>
            {errors.password ? <small>{errors.password}</small> : null}
          </label>
        )}

        {activeMode === "login" && (
          <button
            type="button"
            className="passport-text-btn"
            onClick={() => setMode("forgot")}
          >
            Forgot password?
          </button>
        )}

        {formError ? <p className="passport-error">{formError}</p> : null}
        {notice ? <p className="passport-notice">{notice}</p> : null}
        {devResetUrl ? (
          <p className="passport-notice">
            Dev reset link:{" "}
            <Link to={devResetUrl.replace(window.location.origin, "")}>open it</Link>
          </p>
        ) : null}

        <button type="submit" className="passport-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="passport-spinner" aria-hidden="true" />
              {activeMode === "signup"
                ? "Creating account"
                : activeMode === "forgot"
                  ? "Sending"
                  : "Logging in"}
            </>
          ) : activeMode === "signup" ? (
            "Create account"
          ) : activeMode === "forgot" ? (
            "Send reset link"
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="passport-switch">
        {activeMode === "login" && (
          <p>
            New here?{" "}
            <button type="button" onClick={() => setMode("signup")}>
              Create account
            </button>
          </p>
        )}
        {activeMode === "signup" && (
          <p>
            Already on the survey?{" "}
            <button type="button" onClick={() => setMode("login")}>
              Login
            </button>
          </p>
        )}
        {activeMode === "forgot" && (
          <p>
            Remembered it?{" "}
            <button type="button" onClick={() => setMode("login")}>
              Back to login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
