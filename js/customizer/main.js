/* main.js - Theme and Page Customizer controller. */
import { PRESETS, FONT_LISTS } from './presets.js';
import { COLOR_CONTROLS, themeCss, googleFontsHref, isHex, contrast, presetTheme, exportTheme, importTheme, clone } from './theme.js';
import { buildDoc } from './render.js';
import { blocks as REGISTRY } from '../blocks.js';
import { GROUPS, TEMPLATES, VARIANTS, TONES, SPACES, labelOf, fromDemo, fromTemplate, setSpacing, setTone, getTone, fromSpace, fieldsOf, setP, newUid } from './stack.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KEY = 'finone-customizer-v3';
const VIEWPORTS = { desktop: 0, mobile: 390 };   /* desktop = fluid, fills the canvas; mobile = centred 390px */
import { applyOverrides } from '../demo/overrides.js';
const demo = applyOverrides(await (await fetch('js/demo/granite.json')).json());

/* ---------------- state ---------------- */
const fresh = () => ({ preset: 'granite', theme: presetTheme('granite'), org: { ...PRESETS.granite.org, logo: '', heroImage: '', promoImage: '' },
  stack: fromTemplate(demo, 'home'), selected: null, viewport: 'desktop', controlsHidden: false, showAlert: true, template: 'home', tab: 'brand' });
let state = fresh();
/* Saved state is trusted only if it has the full shape; anything else (old version, hand-edited, corrupt) falls back to defaults. */
const validState = (s) => s && typeof s === 'object' && s.theme?.tokens && s.theme?.fonts?.heading?.[0] && s.theme?.fonts?.body?.[0] && s.theme?.fonts?.rate?.[0]
  && ['button', 'card'].every((k) => s.theme?.geometry?.[k]) && s.org && typeof s.org.name === 'string' && Array.isArray(s.stack) && s.stack.every((b) => b && typeof b.type === 'string' && REGISTRY[b.type] && b.props && typeof b.props === 'object');
const clearSaved = () => { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } };
try {
  const s = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (s) { if (validState(s)) { const f = fresh(); state = { ...f, ...s, org: { ...f.org, ...s.org }, theme: { ...f.theme, ...s.theme, tokens: { ...f.theme.tokens, ...s.theme.tokens } }, controlsHidden: false, selected: null, viewport: 'desktop' }; state.stack.forEach((b) => { b.uid ??= newUid(); }); if (!(state.viewport in VIEWPORTS)) state.viewport = 'desktop'; if (!['brand', 'page'].includes(state.tab)) state.tab = 'brand'; } else clearSaved(); }
} catch (e) { clearSaved(); state = fresh(); }
const save = () => { try { const { controlsHidden, ...rest } = state; const o = clone(rest); ['logo', 'heroImage', 'promoImage'].forEach((k) => { if (String(o.org[k]).startsWith('data:')) o.org[k] = ''; }); localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* quota or blocked: ignore */ } };
const sel = () => state.stack.find((b) => b.uid === state.selected);
const status = (m) => { $('#status').textContent = m; };

/* ---------------- preview frame ---------------- */
const frame = $('#frame'), wrap = $('#wrap'), stage = $('#stage');
let renderTimer = 0, pendingScroll = 0, scrollTo = null;
function fit() {   /* sizing is pure CSS (see #wrap[data-vp]); this just syncs the attribute and status text */
  wrap.dataset.vp = state.viewport; frame.style.cssText = ''; wrap.style.cssText = '';
  status('');
}
function render(immediate) {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    try { pendingScroll = frame.contentWindow?.scrollY || 0; } catch (e) { pendingScroll = 0; }
    try { frame.srcdoc = buildDoc(state); save(); }
    catch (err) { console.error('Preview render failed', err); status('Render error: ' + err.message); }
  }, immediate ? 0 : 220);
}
frame.addEventListener('load', () => {
  const d = frame.contentDocument; if (!d) return;
  if (scrollTo) { d.querySelector(`[data-uid="${scrollTo}"]`)?.scrollIntoView({ block: 'start' }); scrollTo = null; } else frame.contentWindow.scrollTo(0, pendingScroll);
  markSelected();
});
function markSelected() { const d = frame.contentDocument; if (!d) return; d.querySelectorAll('.is-selected').forEach((e) => e.classList.remove('is-selected')); if (state.selected) d.querySelector(`[data-uid="${state.selected}"]`)?.classList.add('is-selected'); }
/* Live token binding: swap the CSS-variable block and font link inside the preview, no reload. */
function applyTheme() {
  const d = frame.contentDocument; save();
  if (d?.getElementById('theme-vars')) { d.getElementById('theme-vars').textContent = themeCss(state.theme); d.getElementById('gf').setAttribute('href', googleFontsHref(state.theme.fonts)); }
  const gf = googleFontsHref(state.theme.fonts); let l = $('#gf-ui'); if (!l) { l = document.createElement('link'); l.id = 'gf-ui'; l.rel = 'stylesheet'; document.head.appendChild(l); } l.href = gf;
}
window.addEventListener('message', (e) => { if (e.data?.type === 'select') { select(e.data.uid, false); setTab('page'); } });
window.addEventListener('resize', fit);

/* ---------------- tabs / toolbar ---------------- */
function setTab(t) { state.tab = t; document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === t)); document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('on', p.id === 'pane-' + t)); }
document.querySelector('.tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setTab(b.dataset.tab); });
$('#vp').addEventListener('change', (e) => { state.viewport = e.target.value; fit(); save(); });
function setHidden(h) { state.controlsHidden = h; document.body.classList.toggle('demo', h); $('#hide').textContent = h ? 'Show controls' : 'Hide controls'; try { frame.contentDocument?.body.classList.toggle('edit', !h); } catch (e) { /* frame not ready */ } fit(); }
$('#hide').addEventListener('click', () => setHidden(!state.controlsHidden));
$('#reset').addEventListener('click', () => { if (confirm('Reset theme, brand data and page to the Granite defaults?')) { state = fresh(); setTab('brand'); paintAll(); render(true); } });

/* ---------------- Brand pane ---------------- */
const fontOpts = (kind, cur) => FONT_LISTS[kind].map(([n]) => `<option${n === cur ? ' selected' : ''}>${esc(n)}</option>`).join('') + `<option value="__custom">Other Google Font...</option>`;
function paintBrand() {
  const t = state.theme, o = state.org;
  const cc = COLOR_CONTROLS.map((c) => { const v = t.tokens[c.token]; return `<div class="row"><label title="${esc(c.token)}">${c.label}</label><input type="color" data-color="${c.key}" value="${v}"><input class="hex" type="text" data-hex="${c.key}" value="${v}" maxlength="7" spellcheck="false"></div><p class="note" style="margin:-4px 0 4px 100px">${esc(c.token)} - ${esc(c.note)}</p>`; }).join('');
  const ratio = contrast(t.tokens['--color-accent'], t.tokens['--color-white']);
  $('#pane-brand').innerHTML = `
  <details open><summary>Presets and export</summary>
    <div class="row"><label>Preset</label><select id="preset">${Object.entries(PRESETS).map(([k, p]) => `<option value="${k}"${k === state.preset ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}<option value="custom"${state.preset === 'custom' ? ' selected' : ''}>Custom / imported</option></select></div>
    <div class="btns"><button class="b" id="imp">Import theme.json</button><button class="b" id="exp">Export theme.json</button><button class="b" id="cpcss">Copy :root CSS</button></div><input type="file" id="impf" accept="application/json,.json" hidden><p class="note" id="expmsg"></p></details>
  <details open><summary>Colors</summary>${cc}
    <p class="note">White text on Primary: <span class="${ratio >= 4.5 ? 'ok' : 'warn'}">${ratio.toFixed(1)}:1 ${ratio >= 4.5 ? 'passes AA' : 'below AA 4.5:1 for buttons'}</span>. Text Light also drives white surfaces.</p></details>
  <details open><summary>Typography</summary>
    ${['heading', 'body', 'rate'].map((k) => `<div class="row"><label>${{ heading: 'Heading', body: 'Body', rate: 'Rate display' }[k]}</label><select data-font="${k}">${fontOpts(k, t.fonts[k][0])}</select></div><div class="row" data-custom="${k}" hidden><label></label><input type="text" data-customfont="${k}" placeholder="Google Font name, e.g. Outfit"></div>`).join('')}
    <p class="note">Only the family changes; the engineer's type scale (sizes, weights, line heights) is untouched.</p></details>
  <details open><summary>Component geometry</summary>
    <div class="row"><label>Button shape</label><div class="seg">${['pill', 'soft', 'square'].map((v) => `<label><input type="radio" name="btn" value="${v}"${t.geometry.button === v ? ' checked' : ''}>${v[0].toUpperCase() + v.slice(1)}</label>`).join('')}</div></div>
    <div class="row"><label>Card radius</label><div class="seg">${['sharp', 'rounded'].map((v) => `<label><input type="radio" name="card" value="${v}"${t.geometry.card === v ? ' checked' : ''}>${v[0].toUpperCase() + v.slice(1)}</label>`).join('')}</div></div></details>
  <details open><summary>Brand assets and org data</summary>
    <div class="row"><label>Org name</label><input type="text" data-org="name" value="${esc(o.name)}"></div>
    <div class="row"><label>Routing #</label><input type="text" data-org="routing" value="${esc(o.routing)}"></div>
    <div class="row"><label>NMLS #</label><input type="text" data-org="nmls" value="${esc(o.nmls)}"></div>
    ${[['logo', 'Logo'], ['heroImage', 'Hero image'], ['promoImage', 'Promo image']].map(([k, l]) => `<div class="row col"><label>${l} URL or upload</label><div class="row" style="margin:0"><input type="text" data-org="${k}" value="${esc(String(o[k]).startsWith('data:') ? '(uploaded file)' : o[k])}" placeholder="https://... or upload"><button class="b sm" data-up="${k}">Upload</button><button class="b sm x" data-clr="${k}" title="Use defaults">x</button></div></div>`).join('')}
    <input type="file" id="upf" accept="image/*" hidden>
    <p class="note">Org name, routing and NMLS re-render the header, footer, alert, disclosures and copy. Hero/Promo images replace the image in every hero and promo block. Uploads live in this session only.</p></details>`;
}
let upKey = '', fupPath = '';
const brand = $('#pane-brand');
brand.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset.color) setColor(t.dataset.color, t.value);
  else if (t.dataset.hex) { if (isHex(t.value)) setColor(t.dataset.hex, t.value, true); }
  else if (t.dataset.org) { state.org[t.dataset.org] = t.value.trim(); render(); }
  else if (t.dataset.customfont && t.value.trim()) { setFont(t.dataset.customfont, [t.value.trim(), 'sans-serif']); }
});
brand.addEventListener('change', (e) => {
  const t = e.target;
  if (t.id === 'preset') { if (t.value !== 'custom') { state.preset = t.value; state.theme = presetTheme(t.value); const o = PRESETS[t.value].org; Object.assign(state.org, o); applyTheme(); paintBrand(); render(true); } }
  else if (t.dataset.font) { if (t.value === '__custom') { $(`[data-custom="${t.dataset.font}"]`).hidden = false; $(`[data-customfont="${t.dataset.font}"]`).focus(); } else { $(`[data-custom="${t.dataset.font}"]`).hidden = true; setFont(t.dataset.font, FONT_LISTS[t.dataset.font].find(([n]) => n === t.value)); } }
  else if (t.name === 'btn') { state.theme.geometry.button = t.value; touchTheme(); }
  else if (t.name === 'card') { state.theme.geometry.card = t.value; touchTheme(); }
  else if (t.id === 'impf') importFile(t.files[0]);
  else if (t.id === 'upf') upload(t.files[0]);
});
brand.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.id === 'imp') $('#impf').click();
  else if (b.id === 'exp') download('theme.json', JSON.stringify(exportTheme(state), null, 2), 'application/json');
  else if (b.id === 'cpcss') navigator.clipboard.writeText(themeCss(state.theme)).then(() => msg(':root CSS copied'), () => msg('Clipboard blocked; use Export instead'));
  else if (b.dataset.up) { upKey = b.dataset.up; $('#upf').value = ''; $('#upf').click(); }
  else if (b.dataset.clr) { state.org[b.dataset.clr] = ''; paintBrand(); render(); }
});
const msg = (m) => { const n = $('#expmsg'); if (n) n.textContent = m; };
function touchTheme() { state.preset = 'custom'; const s = $('#preset'); if (s) s.value = 'custom'; applyTheme(); }
function setColor(key, v, fromHex) {
  const c = COLOR_CONTROLS.find((x) => x.key === key); state.theme.tokens[c.token] = v;
  Object.entries(c.derive ?? {}).forEach(([tok, fn]) => { state.theme.tokens[tok] = fn(v); });
  const pk = brand.querySelector(`[data-color="${key}"]`), hx = brand.querySelector(`[data-hex="${key}"]`);
  if (pk && pk.value !== v) pk.value = v; if (hx && !fromHex) hx.value = v; touchTheme();
}
function setFont(kind, f) { state.theme.fonts[kind] = f; touchTheme(); }
function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); }
async function importFile(f) { if (!f) return; try { const r = importTheme(await f.text()); state.theme = r.theme; if (r.org) Object.assign(state.org, r.org); if (r.page) { state.stack = r.page.filter((x) => x.type && x.props).map((x) => ({ ...x, uid: newUid() })); state.selected = null; paintPage(); } state.preset = 'custom'; applyTheme(); paintBrand(); render(true); msg(`Imported "${r.name}"${r.page ? ` with ${r.page.length} blocks` : ''}`); } catch (err) { msg('Import failed: ' + err.message); } }
function upload(f) { if (!f) return; const r = new FileReader(); r.onload = () => { if (fupPath) { const b = sel(); if (b) { setP(b.props, fupPath, r.result); fupPath = ''; paintPage(); render(true); } return; } state.org[upKey] = r.result; paintBrand(); render(true); }; r.readAsDataURL(f); }

/* ---------------- Page pane ---------------- */
function select(uid, scroll = true) { state.selected = uid; if (scroll) scrollTo = null; paintPage(); markSelected(); if (scroll) frame.contentDocument?.querySelector(`[data-uid="${uid}"]`)?.scrollIntoView({ block: 'start' }); }
function paintPage() {
  const b = sel();
  const list = state.stack.map((x, i) => `<li draggable="true" data-i="${i}" data-uid="${x.uid}" class="${x.uid === state.selected ? 'sel' : ''}${x.hidden ? ' off' : ''}"><span class="gp" title="Drag to reorder">::</span><span class="nm">${esc(labelOf(x))}</span><button class="b sm" data-act="vis" title="${x.hidden ? 'Show' : 'Hide'}">${x.hidden ? 'Show' : 'Hide'}</button><button class="b sm x" data-act="del" title="Remove block" aria-label="Remove block">&times;</button></li>`).join('');
  const lib = GROUPS.map(([g, types]) => { const items = Object.keys(demo).map(Number).sort((a, c) => a - c).filter((i) => types.includes(demo[i].type)); return `<h5>${g}</h5>${items.map((i) => `<div class="it" data-name="${esc(labelOf(demo[i]).toLowerCase())}"><span>${esc(labelOf(demo[i]))}</span><button class="b sm" data-add="${i}">+ Add</button></div>`).join('')}`; }).join('');
  $('#pane-page').innerHTML = `
  <details open><summary>Page</summary>
    <div class="row"><label>Start from</label><select id="tpl">${Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}"${k === state.template ? ' selected' : ''}>${t.name}</option>`).join('')}</select><button class="b" id="tplgo">Load</button></div>
    <label class="chk" style="margin:6px 0"><input type="checkbox" id="showalert"${state.showAlert === false ? '' : ' checked'}>Show alert banner</label>
    <p class="note">${state.stack.length} blocks (${state.stack.filter((x) => !x.hidden).length} visible). Click a block in the preview to select it. Header and footer are always present.</p>
    <ul class="stack" id="stack">${list || '<li style="cursor:default">Empty page - add blocks from the library below.</li>'}</ul></details>
  ${b ? inspector(b) : '<p class="note" style="margin:10px 0">Select a block to edit its spacing, background and variant.</p>'}
  <details><summary>Block library (58)</summary><input type="text" id="libq" placeholder="Filter blocks..." style="margin:8px 0"><div class="lib" id="lib">${lib}</div></details>`;
}
function inspector(b) {
  const sp = b.props.spacing?.section ?? {};
  const spSel = (k) => `<div><label>${k}</label><select data-sp="${k}">${SPACES.map((v) => `<option${fromSpace(sp[k]) === v ? ' selected' : ''}>${v}</option>`).join('')}</select></div>`;
  const vars = (VARIANTS[b.type] ?? []).map(([k, l, opts]) => opts
    ? `<div><label>${l}</label><select data-var="${k}">${opts.map((v) => `<option${String(b.props[k]) === v ? ' selected' : ''}>${v}</option>`).join('')}</select></div>`
    : `<label class="chk"><input type="checkbox" data-var="${k}"${b.props[k] ? ' checked' : ''}>${l}</label>`).join('');
  return `<div class="insp"><h4>${esc(labelOf(b))}</h4>
    <div class="btns"><button class="b sm" data-ins="dup">Duplicate</button><button class="b sm" data-ins="vis">${b.hidden ? 'Show' : 'Hide'}</button><button class="b sm x" data-ins="del">Remove</button></div>
    <h4>Spacing (section)</h4><div class="grid2">${['pt', 'pb', 'mt', 'mb'].map(spSel).join('')}</div>
    <h4>Background tone</h4><div class="grid2"><div><select data-tone>${TONES.map((v) => `<option${getTone(b) === v ? ' selected' : ''}>${v}</option>`).join('')}</select></div></div>
    ${copyFields(b)}
    ${vars ? `<h4>Variants</h4><div class="grid2">${vars}</div>` : ''}</div>`;
}
function copyFields(b) {
  const f = fieldsOf(b); if (!f.length) return '';
  return `<details open><summary style="font-size:11px">Copy and data (${f.length})</summary>${f.map((x) => `<div class="row col" style="margin:6px 0"><label style="flex:none">${esc(x.label)}</label>${x.multi ? `<textarea data-field="${esc(x.path)}" rows="3">${esc(x.value)}</textarea>` : x.image ? `<div class="row" style="margin:0"><input type="text" data-field="${esc(x.path)}" value="${esc(x.value.startsWith('data:') ? '(uploaded file)' : x.value)}" placeholder="https://... or upload"><button class="b sm" data-fup="${esc(x.path)}">Upload</button></div>` : `<input type="text" data-field="${esc(x.path)}"${x.num ? ' inputmode="decimal"' : ''}${x.url ? ' placeholder="https://..."' : ''} value="${esc(x.value)}">`}</div>`).join('')}</details>`;
}
const page = $('#pane-page');
page.addEventListener('click', (e) => {
  const fup = e.target.closest('[data-fup]'); if (fup) { fupPath = fup.dataset.fup; $('#upf').value = ''; $('#upf').click(); return; }
  const li = e.target.closest('li[data-uid]'), act = e.target.closest('[data-act]'), add = e.target.closest('[data-add]'), ins = e.target.closest('[data-ins]');
  if (add) { const nb = fromDemo(demo, +add.dataset.add); const at = state.stack.findIndex((x) => x.uid === state.selected); state.stack.splice(at < 0 ? state.stack.length : at + 1, 0, nb); state.selected = nb.uid; scrollTo = nb.uid; paintPage(); render(true); return; }
  if (e.target.id === 'tplgo') { state.template = $('#tpl').value; state.showAlert = TEMPLATES[$('#tpl').value].alert !== false; const tp = TEMPLATES[$('#tpl').value].preset; if (tp) { state.preset = tp; state.theme = presetTheme(tp); Object.assign(state.org, PRESETS[tp].org); applyTheme(); paintBrand(); } state.stack = fromTemplate(demo, $('#tpl').value); state.selected = null; paintPage(); render(true); return; }
  if (act && li) { const i = +li.dataset.i, x = state.stack[i]; if (act.dataset.act === 'del') { state.stack.splice(i, 1); if (state.selected === x.uid) state.selected = null; } else if (act.dataset.act === 'vis') x.hidden = !x.hidden; else { const j = i + (act.dataset.act === 'up' ? -1 : 1); if (j < 0 || j >= state.stack.length) return; [state.stack[i], state.stack[j]] = [state.stack[j], state.stack[i]]; } paintPage(); render(true); return; }
  if (ins) { const b = sel(), i = state.stack.indexOf(b);
    if (ins.dataset.ins === 'dup') { const c = { ...clone(b), uid: fromDemo(demo, b.idx ?? 0).uid }; state.stack.splice(i + 1, 0, c); state.selected = c.uid; }
    else if (ins.dataset.ins === 'vis') b.hidden = !b.hidden; else { state.stack.splice(i, 1); state.selected = null; }
    paintPage(); render(true); return; }
  if (li && !act) select(li.dataset.uid);
});
page.addEventListener('change', (e) => {
  if (e.target.id === 'showalert') { state.showAlert = e.target.checked; save(); render(true); return; }
  const t = e.target, b = sel();
  if (t.dataset.sp && b) { setSpacing(b, t.dataset.sp, t.value); render(true); }
  else if (t.hasAttribute('data-tone') && b) { setTone(b, t.value); render(true); }
  else if (t.dataset.var && b) { b.props[t.dataset.var] = t.type === 'checkbox' ? t.checked : t.value; if (b.type === 'hero' && t.dataset.var === 'tone') { /* text tone only */ } paintPage(); render(true); }
});
page.addEventListener('input', (e) => {
  const fp = e.target.dataset?.field, b = sel();
  if (fp && b) { const f = fieldsOf(b).find((x) => x.path === fp); setP(b.props, fp, f?.num ? (Number(e.target.value) || 0) : e.target.value); render(); return; }
  if (e.target.id === 'libq') { const q = e.target.value.toLowerCase(); page.querySelectorAll('.lib .it').forEach((n) => { n.hidden = q && !n.dataset.name.includes(q); }); } });
let dragFrom = -1;   // drag-and-drop reorder
page.addEventListener('dragstart', (e) => { const li = e.target.closest('li[data-i]'); if (li) { dragFrom = +li.dataset.i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(dragFrom)); } });
page.addEventListener('dragover', (e) => { const li = e.target.closest('li[data-i]'); if (li && dragFrom >= 0) { e.preventDefault(); page.querySelectorAll('li.over').forEach((n) => n.classList.remove('over')); li.classList.add('over'); } });
page.addEventListener('drop', (e) => { const li = e.target.closest('li[data-i]'); if (li && dragFrom >= 0) { e.preventDefault(); const to = +li.dataset.i; const [m] = state.stack.splice(dragFrom, 1); state.stack.splice(to, 0, m); dragFrom = -1; paintPage(); render(true); } });
page.addEventListener('dragend', () => { dragFrom = -1; page.querySelectorAll('li.over').forEach((n) => n.classList.remove('over')); });

/* ---------------- boot ---------------- */
function paintAll() { paintBrand(); paintPage(); applyTheme(); document.querySelector(`#vp input[value="${state.viewport}"]`).checked = true; setTab(state.tab); }
function boot() { paintAll(); fit(); render(true); }
try { boot(); }
catch (err) {
  console.error('Customizer boot failed with saved state; resetting to defaults.', err);
  clearSaved(); state = fresh(); document.body.classList.remove('demo'); $('#hide').textContent = 'Hide controls';
  try { boot(); status('Saved state was invalid and has been reset'); } catch (e2) { document.body.insertAdjacentHTML('afterbegin', `<pre style="position:fixed;inset:0;z-index:99;margin:0;padding:20px;background:#fff;color:#b00;white-space:pre-wrap">Customizer failed to start: ${esc(e2.message)}</pre>`); }
}
