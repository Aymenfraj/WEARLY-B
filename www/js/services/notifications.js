import { plugin, isNative } from '../core/platform.js';
export async function request() { const L = plugin('LocalNotifications'); if (L && isNative()) return (await L.requestPermissions()).display; if ('Notification' in window) return Notification.requestPermission(); return 'denied'; }
export async function notify(title, body, at) {
  const L = plugin('LocalNotifications'), id = (Math.random() * 2e9) | 0;
  if (L && isNative()) { await L.schedule({ notifications: [{ id, title, body, schedule: at ? { at: new Date(at) } : undefined }] }); return true; }
  if ('Notification' in window && Notification.permission === 'granted') { new Notification(title, { body }); return true; }
  return false;
}
