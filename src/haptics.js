import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

// Taptic feedback in the iOS app, like native apps give it: light taps for navigation and gestures, a stronger one for
// actions, a "success" pattern for matches and joins. Does nothing in the browser.
const native = Capacitor.isNativePlatform();

export const tap = () => native && Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
export const press = () => native && Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
export const success = () => native && Haptics.notification({ type: NotificationType.Success }).catch(() => {});
