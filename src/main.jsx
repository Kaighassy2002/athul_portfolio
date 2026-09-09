import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

function loadFontAwesome() {
  if (document.querySelector("script[data-fa-kit]")) return;
  const script = document.createElement("script");
  script.src = "https://kit.fontawesome.com/3fe1adcfd7.js";
  script.crossOrigin = "anonymous";
  script.dataset.faKit = "true";
  script.defer = true;
  document.head.appendChild(script);
}

if (typeof window !== "undefined") {
  if (document.readyState === "complete") loadFontAwesome();
  else window.addEventListener("load", loadFontAwesome, { once: true });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
