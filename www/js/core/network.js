// Etat de la connexion internet (plugin Network ou navigateur).
import { plugin, isNative } from './platform.js';
import { emit } from './events.js';
let online = navigator.onLine, type = 'inconnu';
export const isOnline = () => online;
export const status = () => ({ online, type });
function set(o, t) { const ch = o !== online; online = o; type = t || type; if (ch) emit('net:change', { online, type }); }
export async function init() {
  const N = plugin('Network');
  if (N && isNative()) { const s = await N.getStatus(); online = s.connected; type = s.connectionType; N.addListener('networkStatusChange', s => set(s.connected, s.connectionType)); }
  else { addEventListener('online', () => set(true, 'wifi')); addEventListener('offline', () => set(false, 'aucun')); }
}
