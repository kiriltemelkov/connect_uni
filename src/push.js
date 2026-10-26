import { Capacitor } from "@capacitor/core";

// Push notifications, iOS app only: the phone's Apple token goes to Supabase and the "push" Edge Function
// (supabase/functions/push) sends the messages. The web and demo versions skip all of this.
let token = null;

export async function startPush(backend, { lang, onOpen }) {
  if (!Capacitor.isNativePlatform()) return () => {};
  const { PushNotifications } = await import("@capacitor/push-notifications");
  const handles = await Promise.all([
    PushNotifications.addListener("registration", ({ value }) => {
      token = value;
      backend.savePushToken(value, lang()).catch(() => {});
    }),
    PushNotifications.addListener("pushNotificationActionPerformed", ({ notification }) => {
      const conversation = notification.data?.conversation;
      if (conversation) onOpen(conversation);
    }),
  ]);
  let status = await PushNotifications.checkPermissions();
  if (status.receive === "prompt") status = await PushNotifications.requestPermissions();
  if (status.receive === "granted") await PushNotifications.register();
  return () => handles.forEach((handle) => handle.remove());
}

// Before signing out: this phone stops getting the account's notifications.
export const forgetPush = (backend) => (token ? backend.deletePushToken(token).catch(() => {}) : Promise.resolve());
