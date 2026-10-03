import { plugin, isNative } from '../core/platform.js';
export async function takePhoto() {
  const C = plugin('Camera');
  if (C && isNative()) { const p = await C.getPhoto({ quality: 80, resultType: 'dataUrl', source: 'PROMPT' }); return p.dataUrl; }
  return new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = () => { const f = i.files[0]; if (!f) return res(null); const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); }; i.click(); });
}
