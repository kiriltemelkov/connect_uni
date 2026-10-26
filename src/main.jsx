import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import ConnectUni from "./ConnectUni.jsx";
import { backend } from "./backend.js";
import { applyTheme } from "./theme.js";
import { trackKeyboard } from "./keyboard.js";

applyTheme();
trackKeyboard();

// Inside the iOS app the page should feel like an app: no pinch or tap-to-zoom, no text selection on long press.
if (Capacitor.isNativePlatform()) {
  document.querySelector('meta[name="viewport"]').content += ", maximum-scale=1.0, user-scalable=no";
  document.documentElement.classList.add("native");
}

// "?demo" runs the app on made-up students instead of the real backend (handy for trying the UI).
const demo = new URLSearchParams(window.location.search).has("demo");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConnectUni backend={demo ? null : backend} />
  </StrictMode>,
);
