function trimSlash(value) {
  return String(value || "").replace(/\/$/, "");
}

const fromEnv = trimSlash(import.meta.env.VITE_SERVER_URL || "");

// Same-origin `/api` is proxied to the backend (Vite in dev, Vercel in production).
// Do not put the Render URL in a VITE_ env var — that bakes it into the public bundle.
export const SERVER_URL = fromEnv || "/api";
