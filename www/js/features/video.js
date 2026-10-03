// Videos facon TikTok : filmer/choisir, enregistrer sur le telephone, envoyer quand le reseau revient.
import * as store from '../core/storage.js';
import * as net from '../core/network.js';
import { post } from '../core/http.js';
import { emit, on } from '../core/events.js';
export const list = () => store.get('videos', []);
export function pick(capture) {
  return new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/*'; if (capture) i.setAttribute('capture', 'camcorder'); i.onchange = () => res(i.files[0] || null); i.click(); });
}
export async function save(file, meta) {
  if (file.size > 200 * 1048576) throw new Error('Video trop lourde (max 200 Mo)');
  const id = 'v' + Date.now(), L = await list();
  await store.blob.put(id, file);
  L.unshift({ id, caption: meta.caption, tags: meta.tags, vis: meta.vis, size: file.size, at: Date.now(), st: 'queued' });
  await store.set('videos', L); emit('videos:change'); await sync();
}
export async function remove(id) { await store.blob.del(id); await store.set('videos', (await list()).filter(v => v.id !== id)); emit('videos:change'); }
export async function sync() {
  if (!net.isOnline()) return;
  const L = await list(); let ch = false;
  for (const v of L) if (v.st === 'queued') { try { const r = await post('/videos', { id: v.id, caption: v.caption, tags: v.tags, vis: v.vis, size: v.size }); if (r.ok) { v.st = 'sent'; ch = true; } } catch (e) { /* reessai plus tard */ } } // TODO serveur : envoyer aussi le fichier (multipart)
  if (ch) { await store.set('videos', L); emit('videos:change'); }
}
on('net:change', s => { if (s.online) sync(); });
