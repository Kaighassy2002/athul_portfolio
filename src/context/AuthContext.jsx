import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  authConfigAPI,
  forgotPasswordAPI,
  googleLoginAPI,
  loginAPI,
  logoutAPI,
  meAPI,
  resendVerificationAPI,
  resetPasswordAPI,
  signupAPI,
  verifyEmailAPI,
} from "../service/allApi";

const USER_KEY = "aqc-user";
const INTENT_KEY = "aqc-auth-intent";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* private mode */
  }
}

function readIntent() {
  try {
    const raw = sessionStorage.getItem(INTENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [stats, setStats] = useState(null);
  const [ready, setReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const [pendingAction, setPendingAction] = useState(() => readIntent());
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleCodeLogin, setGoogleCodeLogin] = useState(false);

  const applySession = useCallback((nextUser, nextStats) => {
    persistUser(nextUser || null);
    setUser(nextUser || null);
    if (nextStats !== undefined) setStats(nextStats);
  }, []);

  const clearSession = useCallback(() => {
    applySession(null);
    setStats(null);
  }, [applySession]);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      const config = await authConfigAPI();
      if (!cancelled && config.ok) {
        setGoogleClientId(String(config.data.googleClientId || "").trim());
        setGoogleCodeLogin(Boolean(config.data.googleCodeLogin));
      }

      const profile = await meAPI();
      if (cancelled) return;
      if (profile.ok) {
        applySession(profile.data.user, profile.data.stats);
      } else {
        clearSession();
      }
      setReady(true);
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, [applySession, clearSession]);

  const openAuth = useCallback((options = {}) => {
    const { mode = "login", message = "", intent = null } = options;
    if (intent) {
      setPendingAction(intent);
      try {
        sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
      } catch {
        /* private mode */
      }
    }
    setAuthMode(mode);
    setAuthMessage(message);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  const consumePendingAction = useCallback(() => {
    const current = pendingAction || readIntent();
    setPendingAction(null);
    try {
      sessionStorage.removeItem(INTENT_KEY);
    } catch {
      /* private mode */
    }
    return current;
  }, [pendingAction]);

  const handleAuthSuccess = useCallback(
    (data) => {
      applySession(data.user);
      setAuthOpen(false);
      meAPI().then((profile) => {
        if (profile.ok) {
          applySession(profile.data.user, profile.data.stats);
        }
      });
      return data.user;
    },
    [applySession]
  );

  const login = useCallback(
    async (payload) => {
      const result = await loginAPI(payload);
      if (result.ok) handleAuthSuccess(result.data);
      return result;
    },
    [handleAuthSuccess]
  );

  const signup = useCallback(async (payload) => {
    return signupAPI(payload);
  }, []);

  const loginWithGoogle = useCallback(
    async (payload) => {
      const result = await googleLoginAPI(payload);
      if (result.ok) handleAuthSuccess(result.data);
      return result;
    },
    [handleAuthSuccess]
  );

  const forgotPassword = useCallback(async (payload) => {
    return forgotPasswordAPI(payload);
  }, []);

  const resetPassword = useCallback(
    async (payload) => {
      const result = await resetPasswordAPI(payload);
      if (result.ok) handleAuthSuccess(result.data);
      return result;
    },
    [handleAuthSuccess]
  );

  const verifyEmail = useCallback(
    async (payload) => {
      const result = await verifyEmailAPI(payload);
      if (result.ok) handleAuthSuccess(result.data);
      return result;
    },
    [handleAuthSuccess]
  );

  const resendVerification = useCallback(async (payload) => {
    return resendVerificationAPI(payload);
  }, []);

  const logout = useCallback(async () => {
    await logoutAPI();
    clearSession();
    setPendingAction(null);
    try {
      sessionStorage.removeItem(INTENT_KEY);
    } catch {
      /* private mode */
    }
  }, [clearSession]);

  const requireAuth = useCallback(
    (intent, message = "Login to interact with this post.") => {
      if (user) return false;
      openAuth({
        mode: "login",
        message,
        intent,
      });
      return true;
    },
    [openAuth, user]
  );

  const value = useMemo(
    () => ({
      user,
      stats,
      ready,
      authOpen,
      authMode,
      authMessage,
      pendingAction,
      googleClientId,
      googleEnabled: Boolean(googleClientId),
      googleCodeLogin,
      setAuthMode,
      openAuth,
      closeAuth,
      consumePendingAction,
      login,
      signup,
      loginWithGoogle,
      forgotPassword,
      resetPassword,
      verifyEmail,
      resendVerification,
      logout,
      requireAuth,
    }),
    [
      user,
      stats,
      ready,
      authOpen,
      authMode,
      authMessage,
      pendingAction,
      googleClientId,
      googleCodeLogin,
      openAuth,
      closeAuth,
      consumePendingAction,
      login,
      signup,
      loginWithGoogle,
      forgotPassword,
      resetPassword,
      verifyEmail,
      resendVerification,
      logout,
      requireAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
