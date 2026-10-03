// Microphone (enregistrement) et sons de l'interface.
let rec, chunks = [], ac;
export async function startRecording() { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); chunks = []; rec = new MediaRecorder(s); rec.ondataavailable = e => chunks.push(e.data); rec._s = s; rec.start(); }
export function stopRecording() { return new Promise(res => { rec.onstop = () => { rec._s.getTracks().forEach(t => t.stop()); res(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); }; rec.stop(); }); }
export function tone(f = 660, ms = 150) { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = .08; o.connect(g); g.connect(ac.destination); o.start(); setTimeout(() => o.stop(), ms); }
