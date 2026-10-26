import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

// iOS app: the keyboard slides over the app (capacitor.config.json: Keyboard.resize "none"), and chats and sheets move up
// together with it through the CSS variable --uc-kb (src/index.css). Letting iOS shrink the whole web view instead
// ("native") only happens after the keyboard has finished opening, so the message field sat behind it for half a second.
export function trackKeyboard() {
  if (!Capacitor.isNativePlatform()) return;
  const root = document.documentElement;
  let height = 0;
  const set = (px) => {
    height = px;
    root.style.setProperty("--uc-kb", `${px}px`);
  };
  Keyboard.addListener("keyboardWillShow", ({ keyboardHeight }) => {
    set(keyboardHeight);
    // Once everything has moved, bring a field the keyboard still covers into view (forms in sheets, the sign-up page).
    setTimeout(() => {
      const field = document.activeElement;
      if (!field?.matches?.("input, textarea, select")) return;
      if (field.getBoundingClientRect().bottom > window.innerHeight - height - 12) field.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 350);
  }).catch(() => {});
  Keyboard.addListener("keyboardWillHide", () => set(0)).catch(() => {});
}
