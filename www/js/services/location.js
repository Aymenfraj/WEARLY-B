import { plugin, isNative } from '../core/platform.js';
export async function request() { const G = plugin('Geolocation'); if (G && isNative()) return (await G.requestPermissions({ permissions: ['location'] })).location; return 'prompt'; }
export async function current() {
  const G = plugin('Geolocation');
  if (G && isNative()) { const p = await G.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 }); return { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy }; }
  return new Promise((res, rej) => navigator.geolocation.getCurrentPosition(p => res({ lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy }), rej, { timeout: 10000 }));
}
