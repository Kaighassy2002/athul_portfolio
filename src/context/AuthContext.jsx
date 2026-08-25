import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  authConfigAPI,
  forgotPasswordAPI,
  googleLoginAPI,
  loginAPI,
  meAPI,
  resetPasswordAPI,
  signupAPI,
} from "../service/allApi";
import { setAuthToken } from "../service/commonAPI";

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

  const applySession = useCallback((token, nextUser, nextStats) => {
    if (token !== undefined) setAuthToken(token || "");
    persistUser(nextUser || null);
    setUser(nextUser || null);
    if (nextStats !== undefined) setStats(nextStats);
  }, []);

  const clearSession = useCallback(() => {
    applySession("", null);
    setStats(null);
  }, [applySession]);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      const config = await authConfigAPI();
      if (!cancelled && config.ok) {
        setGoogleClientId(config.data.googleClientId || "");
      }

      const stored = readStoredUser();
      const hasToken = Boolean(localStorage.getItem("aqc-token"));
      if (!stored && !hasToken) {
        if (!cancelled) setReady(true);
        return;
      }

      const profile = await meAPI();
      if (cancelled) return;
      if (profile.ok) {
        applySession(undefined, profile.data.user, profile.data.stats);
      } else if (profile.status === 401) {
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
      applySession(data.token, data.user);
      setAuthOpen(false);
      meAPI().then((profile) => {
        if (profile.ok) {
          applySession(data.token, profile.data.user, profile.data.stats);
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

  const signup = useCallback(
    async (payload) => {
      const result = await signupAPI(payload);
      if (result.ok) handleAuthSuccess(result.data);
      return result;
    },
    [handleAuthSuccess]
  );

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

  const logout = useCallback(() => {
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
      setAuthMode,
      openAuth,
      closeAuth,
      consumePendingAction,
      login,
      signup,
      loginWithGoogle,
      forgotPassword,
      resetPassword,
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
      openAuth,
      closeAuth,
      consumePendingAction,
      login,
      signup,
      loginWithGoogle,
      forgotPassword,
      resetPassword,
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
