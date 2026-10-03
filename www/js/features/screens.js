// Ecrans ajoutes : Publier, Mes videos, Telephone & reseau.
import * as video from './video.js';
import * as net from '../core/network.js';
import * as store from '../core/storage.js';
import * as loc from '../services/location.js';
import * as aud from '../services/audio.js';
import * as notif from '../services/notifications.js';
import { on } from '../core/events.js';
const U = window.WEARLY_UI, V = U.V, sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const inp = 'width:100%;padding:12px;border-radius:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx);margin-top:10px';
let d = { file: null, url: '', cap: '', tags: '', vis: 'public' }, info = {};
const re = () => U.go();
V.publier = () => `<div class="fade"><h1>🎥 Publier une vidéo</h1>
<div class="row" style="gap:8px;margin:12px 0"><button class="btn" onclick="WRL.pick(true)">🎥 Filmer</button><button class="btn o" onclick="WRL.pick(false)">📁 Galerie</button></div>
${d.url ? `<video src="${d.url}" controls playsinline style="width:100%;max-height:340px;border-radius:18px;background:#000"></video>` : '<div class="card mu" style="text-align:center;padding:30px">Aucune vidéo choisie</div>'}
<input style="${inp}" placeholder="Légende" value="${esc(d.cap)}" oninput="WRL.set('cap',this.value)">
<input style="${inp}" placeholder="#mode #wax #dakar" value="${esc(d.tags)}" oninput="WRL.set('tags',this.value)">
<div class="row wrap" style="margin:12px 0">${[['public', '🌍 Public'], ['friends', '👥 Amis'], ['private', '🔒 Privé']].map(v => `<span class="chip ${d.vis === v[0] ? 'on' : ''}" onclick="WRL.vis('${v[0]}')">${v[1]}</span>`).join('')}</div>
<button class="btn full" onclick="WRL.publish()">Publier</button>
<div class="mu" style="margin-top:8px">${net.isOnline() ? 'En ligne : envoi immédiat.' : '📡 Hors ligne : la vidéo est gardée sur ton téléphone et envoyée au retour du réseau.'}</div></div>`;
V.mesvideos = () => { setTimeout(hydrate, 0); return `<div class="fade"><div class="row sp"><h1>🎬 Mes vidéos</h1><button class="btn sm" onclick="WEARLY_UI.goTab('publier')">＋ Publier</button></div><div id="vfeed" style="margin-top:12px"><div class="card mu">Chargement…</div></div></div>`; };
async function hydrate() {
  const L = await video.list(), el = document.getElementById('vfeed'); if (!el) return;
  if (!L.length) { el.innerHTML = '<div class="card mu">Aucune vidéo. Appuie sur ＋ Publier.</div>'; return; }
  el.style.cssText = 'height:calc(100vh - 230px);overflow-y:scroll;scroll-snap-type:y mandatory;border-radius:20px';
  el.innerHTML = L.map(v => `<div style="height:100%;scroll-snap-align:start;position:relative;background:#000;border-radius:20px;overflow:hidden"><video data-id="${v.id}" loop muted playsinline onclick="this.muted=!this.muted" style="width:100%;height:100%;object-fit:cover"></video><div style="position:absolute;left:0;right:0;bottom:0;padding:16px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.8))"><b>${esc(v.caption || 'Sans titre')}</b><div style="font-size:12.5px;opacity:.9">${esc(v.tags)}</div><div class="row sp" style="margin-top:8px"><span class="chip on" style="font-size:11px">${v.st === 'sent' ? '✅ Envoyée' : '⏳ En attente de réseau'}</span><button class="btn o sm" style="color:#fff" onclick="WRL.del('${v.id}')">🗑️</button></div></div></div>`).join('');
  const io = new IntersectionObserver(es => es.forEach(e => { e.isIntersecting ? e.target.play().catch(() => { }) : e.target.pause(); }), { root: el, threshold: .6 });
  for (const m of el.querySelectorAll('video')) { const b = await store.blob.get(m.dataset.id); if (b) { m.src = URL.createObjectURL(b); io.observe(m); } }
}
V.reglages = () => {
  store.usage().then(u => { const e = document.getElementById('use'); if (e) e.textContent = (u.used / 1048576).toFixed(1) + ' Mo utilisés'; });
  video.list().then(L => { const e = document.getElementById('qn'); if (e) e.textContent = L.filter(v => v.st === 'queued').length + ' vidéo(s) en attente'; });
  const s = net.status(), row = (ic, t, st, b) => `<div class="card"><div class="row sp"><div><b>${ic} ${t}</b><div class="mu" style="margin-top:3px">${st}</div></div>${b}</div></div>`;
  return `<div class="fade"><h1>📱 Téléphone & réseau</h1><div class="mu" style="margin:6px 0 12px">Teste chaque fonction du téléphone.</div>
${row('📡', 'Réseau', (s.online ? '🟢 En ligne' : '🔴 Hors ligne') + ' · ' + s.type + '<br><span id="qn"></span>', '<button class="btn sm" onclick="WRL.sync()">Synchroniser</button>')}
${row('📍', 'Localisation', info.loc || 'Non testée', '<button class="btn sm" onclick="WRL.loc()">Tester</button>')}
${row('🎙️', 'Microphone', info.mic || 'Non testé', '<button class="btn sm" onclick="WRL.mic()">Tester 3 s</button>')}${info.micUrl ? `<audio controls src="${info.micUrl}" style="width:100%;margin-bottom:10px"></audio>` : ''}
${row('🔊', 'Son', 'Bip de l’application', '<button class="btn sm" onclick="WRL.sound()">Écouter</button>')}
${row('🔔', 'Notifications', info.nt || 'Non testées', '<button class="btn sm" onclick="WRL.notif()">Autoriser</button>')}
${row('💾', 'Stockage', '<span id="use">…</span>', '')}</div>`;
};
window.WRL = {
  async pick(c) { const f = await video.pick(c); if (!f) return; if (d.url) URL.revokeObjectURL(d.url); d.file = f; d.url = URL.createObjectURL(f); re(); },
  set(k, v) { d[k] = v; }, vis(v) { d.vis = v; re(); },
  async publish() { if (!d.file) return U.toast('Choisis une vidéo'); try { await video.save(d.file, { caption: d.cap, tags: d.tags, vis: d.vis }); d = { file: null, url: '', cap: '', tags: '', vis: 'public' }; U.toast(net.isOnline() ? '✅ Vidéo publiée' : '📡 Enregistrée, envoi au retour du réseau'); U.goTab('mesvideos'); } catch (e) { U.toast('⚠️ ' + e.message); } },
  async del(id) { await video.remove(id); re(); },
  async sync() { await video.sync(); re(); },
  async loc() { try { await loc.request(); const c = await loc.current(); info.loc = `📍 ${c.lat.toFixed(4)}, ${c.lon.toFixed(4)} (±${Math.round(c.acc)} m)`; } catch (e) { info.loc = '⚠️ ' + (e.message || 'refusée'); } re(); },
  async mic() { try { await aud.startRecording(); info.mic = '🎙️ Enregistrement 3 s…'; re(); await sleep(3000); const b = await aud.stopRecording(); info.mic = '✅ Micro OK (' + Math.round(b.size / 1024) + ' Ko)'; info.micUrl = URL.createObjectURL(b); } catch (e) { info.mic = '⚠️ ' + (e.message || 'refusé'); } re(); },
  sound() { aud.tone(660, 200); setTimeout(() => aud.tone(880, 200), 220); },
  async notif() { const r = await notif.request(); info.nt = r === 'granted' ? '✅ Autorisées' : '⚠️ ' + r; if (r === 'granted') await notif.notify('WEARLY', 'Notification de test 🔔'); re(); }
};
const ov = V.videos; V.videos = () => ov() + '<button class="fab" onclick="WEARLY_UI.goTab(\'publier\')">＋</button>';
on('net:change', () => { if (U.S.tab === 'reglages' || U.S.tab === 'publier') re(); });
