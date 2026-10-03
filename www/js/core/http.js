// Client API : delai max, reessais exponentiels, jeton, file d'attente hors ligne (outbox).
import { CONFIG } from './config.js';
import { isOnline } from './network.js';
import * as store from './storage.js';
import { emit, on } from './events.js';
let token = null;
export const setToken = t => { token = t; store.set('token', t); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function enqueue(j) { const q = await store.get('outbox', []); q.push({ ...j, id: Date.now() + Math.random() }); await store.set('outbox', q); emit('outbox:change', q.length); }
export async function request(method, path, body, opt = {}) {
  if (!CONFIG.API_BASE) return { ok: true, mock: true, data: null }; // pas encore de serveur : mode demo
  if (!isOnline()) { if (opt.queue) { await enqueue({ method, path, body }); return { ok: true, queued: true }; } throw new Error('Hors ligne'); }
  let err;
  for (let i = 0; i < CONFIG.RETRIES; i++) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), CONFIG.TIMEOUT);
    try {
      const r = await fetch(CONFIG.API_BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: c.signal });
      clearTimeout(t);
      if (r.status < 500) return { ok: r.ok, status: r.status, data: await r.json().catch(() => null) };
      err = new Error('HTTP ' + r.status);
    } catch (e) { clearTimeout(t); err = e; }
    await sleep(500 * 2 ** i);
  }
  if (opt.queue) { await enqueue({ method, path, body }); return { ok: true, queued: true }; }
  throw err;
}
export const get = (p, o) => request('GET', p, null, o);
export const post = (p, b, o) => request('POST', p, b, o);
export const pending = async () => (await store.get('outbox', [])).length;
export async function flush() {
  if (!isOnline() || !CONFIG.API_BASE) return;
  const q = await store.get('outbox', []), rest = [];
  for (const j of q) { try { const r = await request(j.method, j.path, j.body); if (!r.ok && r.status >= 500) rest.push(j); } catch (e) { rest.push(j); } }
  await store.set('outbox', rest); emit('outbox:change', rest.length);
}
on('net:change', s => { if (s.online) flush(); });
