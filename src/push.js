import { Capacitor } from "@capacitor/core";

// Push notifications, iOS app only: the phone's Apple token goes to Supabase and the "push" Edge Function
// (supabase/functions/push) sends the messages. The web and demo versions skip all of this.
let token = null;
const state = { permission: "unknown", saved: false, error: "" };
const failure = (error) => String(error?.message ?? error?.error ?? error);

// What the profile sheet shows: permission ("granted", "denied", "prompt"), whether this phone's token reached the
// server, and the last error.
export const pushState = () => ({ ...state });

// Asks for permission if iOS hasn't been asked yet, then registers with Apple.
async function enable(PushNotifications) {
  let { receive } = await PushNotifications.checkPermissions();
  if (receive === "prompt") ({ receive } = await PushNotifications.requestPermissions());
  state.permission = receive;
  if (receive === "granted") await PushNotifications.register();
}

export async function startPush(backend, { lang, onOpen }) {
  if (!Capacitor.isNativePlatform()) return () => {};
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    const handles = await Promise.all([
      PushNotifications.addListener("registration", ({ value }) => {
        token = value;
        backend.savePushToken(value, lang()).then(
          () => {
            state.saved = true;
            state.error = "";
          },
          (error) => {
            state.error = failure(error);
          },
        );
      }),
      PushNotifications.addListener("registrationError", (error) => {
        state.error = failure(error);
      }),
      PushNotifications.addListener("pushNotificationActionPerformed", ({ notification }) => {
        const conversation = notification.data?.conversation;
        if (conversation) onOpen(conversation);
      }),
    ]);
    await enable(PushNotifications);
    return () => handles.forEach((handle) => handle.remove());
  } catch (error) {
    state.error = failure(error);
    return () => {};
  }
}

// The "turn on" button in the profile sheet: asks again (only possible while iOS hasn't been asked), shows what went wrong.
export async function enablePush() {
  try {
    await enable((await import("@capacitor/push-notifications")).PushNotifications);
  } catch (error) {
    state.error = failure(error);
  }
}

// Before signing out: this phone stops getting the account's notifications.
export const forgetPush = (backend) => (token ? backend.deletePushToken(token).catch(() => {}) : Promise.resolve());
