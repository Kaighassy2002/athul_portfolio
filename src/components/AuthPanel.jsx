import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let gisPromise;

function gisReady() {
  return Boolean(window.google?.accounts?.oauth2);
}

function loadGoogleIdentity() {
  if (gisReady()) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    const started = Date.now();
    const wait = () => {
      if (gisReady()) {
        resolve();
        return;
      }
      if (Date.now() - started > 8000) {
        reject(new Error("Google failed to load"));
        return;
      }
      window.setTimeout(wait, 40);
    };

    const existing = document.querySelector("script[data-gis='true']");
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.gis = "true";
      script.onerror = () => reject(new Error("Google failed to load"));
      document.head.appendChild(script);
    }
    wait();
  }).catch((error) => {
    gisPromise = null;
    throw error;
  });
  return gisPromise;
}

function googleErrorMessage(error) {
  const type = String(error?.type || error?.message || "").toLowerCase();
  if (type.includes("popup_failed") || type.includes("popup_blocked")) {
    return "The Google window was blocked. Allow popups and try again.";
  }
  if (type.includes("popup_closed") || type.includes("cancel")) {
    return "Google login was cancelled.";
  }
  if (type.includes("origin")) {
    return "This site origin is not allowed for Google login.";
  }
  return "Google login could not start.";
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
    googleCodeLogin,
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
  const googleCodeClientRef = useRef(null);
  const googleTokenClientRef = useRef(null);
  const loginWithGoogleRef = useRef(loginWithGoogle);
  const finishRef = useRef(null);

  loginWithGoogleRef.current = loginWithGoogle;

  useEffect(() => {
    if (!googleEnabled) return undefined;
    loadGoogleIdentity().catch(() => {});
  }, [googleEnabled]);

  useEffect(() => {
    googleCodeClientRef.current = null;
    googleTokenClientRef.current = null;
  }, [googleClientId]);

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
    if (activeMode !== "forgot" && (
      form.password.length < 8 ||
      !/[A-Za-z]/.test(form.password) ||
      !/\d/.test(form.password)
    )) {
      next.password = "Use 8+ characters with a letter and a number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finish = (result) => {
    if (!result.ok) {
      setFormError(result.message);
      if (result.code === "USE_GOOGLE" || result.code === "USE_PASSWORD") setMode("login");
      if (result.code === "EMAIL_UNVERIFIED") {
        setNotice("Please verify your email. A letter should already be on the way.");
      }
      return false;
    }
    onSuccess?.(result.data.user);
    return true;
  };

  finishRef.current = finish;

  const completeGoogle = async (payload) => {
    setLoading(true);
    try {
      const result = await loginWithGoogleRef.current(payload);
      finishRef.current?.(result);
    } finally {
      setLoading(false);
    }
  };
  const completeGoogleRef = useRef(completeGoogle);
  completeGoogleRef.current = completeGoogle;

  useEffect(() => {
    if (!googleEnabled || activeMode === "forgot") return undefined;
    let cancelled = false;

    const onGoogleError = (error) => {
      setFormError(googleErrorMessage(error));
      setLoading(false);
    };

    loadGoogleIdentity()
      .then(() => {
        if (cancelled) return;
        const oauth2 = window.google?.accounts?.oauth2;
        if (!oauth2) return;

        if (oauth2.initCodeClient) {
          googleCodeClientRef.current = oauth2.initCodeClient({
            client_id: googleClientId,
            scope: "openid email profile",
            ux_mode: "popup",
            callback: (response) => {
              if (response.error || !response.code) {
                onGoogleError(response);
                return;
              }
              completeGoogleRef.current({ code: response.code });
            },
            error_callback: onGoogleError,
          });
        }

        if (oauth2.initTokenClient) {
          googleTokenClientRef.current = oauth2.initTokenClient({
            client_id: googleClientId,
            scope: "openid email profile",
            callback: (response) => {
              if (response.error || !response.access_token) {
                onGoogleError(response);
                return;
              }
              completeGoogleRef.current({ accessToken: response.access_token });
            },
            error_callback: onGoogleError,
          });
        }
      })
      .catch(() => {
        if (!cancelled) setFormError("Google login could not start.");
      });

    return () => {
      cancelled = true;
    };
  }, [activeMode, googleClientId, googleEnabled]);

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
        const result = await signup({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        if (!result.ok) {
          setFormError(result.message);
          if (result.code === "USE_GOOGLE") setMode("login");
          return;
        }
        setNotice(result.data.message || "Check your email to verify the account.");
        if (result.data.devVerifyUrl) setDevResetUrl(result.data.devVerifyUrl);
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

  const onGoogle = () => {
    if (!googleEnabled) {
      setFormError("Google login is not configured yet.");
      return;
    }
    setFormError("");

    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2) {
      loadGoogleIdentity().catch(() => {});
      setFormError("Google is still loading. Try again in a moment.");
      return;
    }

    if (googleCodeLogin) {
      if (!googleCodeClientRef.current && oauth2.initCodeClient) {
        googleCodeClientRef.current = oauth2.initCodeClient({
          client_id: googleClientId,
          scope: "openid email profile",
          ux_mode: "popup",
          callback: (response) => {
            if (response.error || !response.code) {
              setFormError(googleErrorMessage(response));
              setLoading(false);
              return;
            }
            completeGoogle({ code: response.code });
          },
          error_callback: (error) => {
            setFormError(googleErrorMessage(error));
            setLoading(false);
          },
        });
      }
      if (googleCodeClientRef.current?.requestCode) {
        googleCodeClientRef.current.requestCode();
        return;
      }
    }

    if (!googleTokenClientRef.current && oauth2.initTokenClient) {
      googleTokenClientRef.current = oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: (response) => {
          if (response.error || !response.access_token) {
            setFormError(googleErrorMessage(response));
            setLoading(false);
            return;
          }
          completeGoogle({ accessToken: response.access_token });
        },
        error_callback: (error) => {
          setFormError(googleErrorMessage(error));
          setLoading(false);
        },
      });
    }

    if (googleTokenClientRef.current?.requestAccessToken) {
      googleTokenClientRef.current.requestAccessToken({ prompt: "select_account" });
      return;
    }

    setFormError("Google login could not start.");
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
                placeholder="8+ characters, letter and number"
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
            Dev link:{" "}
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
