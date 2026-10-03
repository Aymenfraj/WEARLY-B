// Point d'entree : demarre les modules et les relie a l'interface.
import * as events from './core/events.js';
import * as net from './core/network.js';
import * as http from './core/http.js';
import * as video from './features/video.js';
import * as notif from './services/notifications.js';
import { plugin, isNative } from './core/platform.js';
import './features/screens.js';
window.WEARLY = { emit: events.emit, on: events.on, net, http, video, notif };
(async () => {
  await net.init();
  const bar = document.createElement('div'); bar.id = 'netbar'; document.body.appendChild(bar);
  const upd = () => { bar.className = net.isOnline() ? '' : 'show'; bar.textContent = '📡 Hors ligne : tes actions seront envoyées au retour du réseau'; };
  events.on('net:change', upd); upd(); video.sync();
  // Rappel de retour d'un pret/location (vestiaire des amis) : la veille a 9h
  events.on('loan:out', async ({ req, item }) => {
    const at = new Date(req.to + 'T09:00:00'); at.setDate(at.getDate() - 1);
    if (at > new Date() && (await notif.request()) === 'granted') notif.notify('⏰ Retour demain', (item ? item.n : 'Article') + ' doit être rendu demain', at);
  });
  const A = plugin('App');   // bouton retour Android
  if (A && isNative()) A.addListener('backButton', () => { const U = window.WEARLY_UI; if (U.S.tab !== 'home') U.goTab('home'); else A.exitApp(); });
})();
