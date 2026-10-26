import { Capacitor } from "@capacitor/core";

// Light, dark, or follow the phone. The choice stays on the device; "dark" on <html> switches the palette in index.css.
const KEY = "connectuni.theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

export function getTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme = getTheme()) {
  const dark = theme === "dark" || (theme === "system" && media.matches);
  document.documentElement.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0a0a0c" : "#fafafa");
  if (Capacitor.isNativePlatform()) {
    // Status bar text: light on a dark app, dark on a light one; the keyboard matches the app.
    import("@capacitor/status-bar").then(({ StatusBar, Style }) => StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light })).catch(() => {});
    import("@capacitor/keyboard")
      .then(({ Keyboard, KeyboardStyle }) => Keyboard.setStyle({ style: dark ? KeyboardStyle.Dark : KeyboardStyle.Light }))
      .catch(() => {});
  }
}

export function setTheme(theme) {
  try {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, sandboxed frames).
  }
  applyTheme(theme);
}

media.addEventListener("change", () => applyTheme());
