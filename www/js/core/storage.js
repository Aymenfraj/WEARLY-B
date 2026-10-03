// Stockage : Preferences (natif) ou localStorage ; blobs (videos) dans IndexedDB.
import { plugin, isNative } from './platform.js';
export async function set(k, v) {
  const s = JSON.stringify(v), P = plugin('Preferences');
  if (P && isNative()) await P.set({ key: k, value: s }); else localStorage.setItem(k, s);
}
export async function get(k, d = null) {
  const P = plugin('Preferences'); let s;
  if (P && isNative()) s = (await P.get({ key: k })).value; else s = localStorage.getItem(k);
  try { return s == null ? d : JSON.parse(s); } catch (e) { return d; }
}
export async function remove(k) {
  const P = plugin('Preferences');
  if (P && isNative()) await P.remove({ key: k }); else localStorage.removeItem(k);
}
const idb = () => new Promise((res, rej) => { const r = indexedDB.open('wearly', 1); r.onupgradeneeded = () => r.result.createObjectStore('blobs'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const tx = async (m, f) => { const db = await idb(); return new Promise((res, rej) => { const t = db.transaction('blobs', m), q = f(t.objectStore('blobs')); t.oncomplete = () => res(q.result); t.onerror = () => rej(t.error); }); };
export const blob = { put: (k, b) => tx('readwrite', s => s.put(b, k)), get: k => tx('readonly', s => s.get(k)), del: k => tx('readwrite', s => s.delete(k)) };
export async function usage() { try { const e = await navigator.storage.estimate(); return { used: e.usage, quota: e.quota }; } catch (x) { return { used: 0, quota: 0 }; } }
