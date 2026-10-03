// Bus d'evenements : les modules communiquent sans se connaitre.
const h = {};
export const on = (e, f) => ((h[e] = h[e] || []).push(f), () => { h[e] = h[e].filter(x => x !== f); });
export const emit = (e, d) => (h[e] || []).forEach(f => { try { f(d); } catch (x) { console.error(x); } });
