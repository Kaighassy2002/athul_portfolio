const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (isLocalHost
    ? "http://localhost:3000"
    : "https://athul-portfolio-server.onrender.com");
