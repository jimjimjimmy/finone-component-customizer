/* verify.js - structural diff of every rendered block against the engineer's live markup (source/blocks.html).
   Open kitchen-sink.html?verify. Canonicalisation ignores: image host / asset folder, responsive srcset/sizes/loading attrs,
   WordPress-generated ids, and brand colours (token var() == the hex it resolves to).                                          */
import { renderBlock, siteHeader, siteFooter } from './blocks.js';
import { header, footer } from './demo/chrome.js';

const HEX = {}; // token -> hex, read from computed :root so it follows whatever preset is loaded
const tokenHex = () => { const cs = getComputedStyle(document.documentElement); for (const n of ['accent','accent-dark','dark','secondary','tint','tertiary','tertiary-light','highlight','surface','white','black']) HEX[`var(--color-${n})`] = cs.getPropertyValue(`--color-${n}`).trim().toLowerCase(); };
const toHex = (v) => v.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (_, r, g, b) => '#' + [r, g, b].map((x) => (+x).toString(16).padStart(2, '0')).join(''));
const normStyle = (s) => { let x = s.toLowerCase(); for (const [k, v] of Object.entries(HEX)) x = x.split(k).join(v); x = toHex(x).replace(/https:\/\/finone\.finalytics\.ai\/wp-content\/uploads\/|assets\/uploads\//g, 'U/').replace(/#fff\b/g, '#ffffff'); return x.replace(/\s+/g, '').replace(/;$/, ''); };
const SKIP_ATTR = /^(srcset|sizes|loading|decoding|width|height|fetchpriority|tabindex|data-ketch.*|aria-describedby)$/;
const normUrl = (u) => u.replace(/^https?:\/\/finone\.finalytics\.ai/, '').replace(/^\/wp-content\/uploads\//, 'U/').replace(/^assets\/uploads\//, 'U/').replace(/\.(webp|png)$/, '.$1');
function canon(node, depth = 0) {
  if (node.nodeType === 3) { const t = node.textContent.replace(/\s+/g, ' ').trim(); return t ? [JSON.stringify(t)] : []; }
  if (node.nodeType !== 1) return [];
  if (['SCRIPT', 'STYLE'].includes(node.tagName)) return [];
  const a = [];
  for (const { name, value } of [...node.attributes].sort((x, y) => x.name.localeCompare(y.name))) {
    if (SKIP_ATTR.test(name)) continue;
    let v = value;
    if (name === 'class') v = v.split(/\s+/).filter(Boolean).sort().join(' ');
    else if (name === 'style') { v = normStyle(v); const f = v.match(/^fill:(#[0-9a-f]+)$/); if (f) { a.push(`fill=${f[1]}`); continue; } }
    else if (name === 'fill') v = v.toLowerCase();
    else if (['src', 'href', 'action'].includes(name)) v = normUrl(v);
    else if (/^(id|for|aria-labelledby|aria-controls|data-bs-target|data-count)$/.test(name) && /\d{3,}|[0-9a-f]{12,}/.test(v) && !/^(tab|heading|collapse)-/.test(v)) v = v.replace(/\d{3,}|[0-9a-f]{12,}/g, 'N');
    else if (name === 'id' && /menu-item|ubermenu|^[0-9a-f]{10,}$/.test(v)) v = 'N';
    if (name === 'class') v = v.replace(/\b(ubermenu-(item|submenu-id|row-id|column-id)-)\d+/g, '$1N').replace(/\bmenu-item-\d+/g, 'menu-item-N');
    if (name === 'id' && /^(tab-|tabs-|heading-|collapse-)/.test(v)) v = v.replace(/[0-9a-f]{20,}|\d+/g, 'N');
    if (/^(aria-controls|aria-labelledby|data-bs-target)$/.test(name)) v = v.replace(/[0-9a-f]{20,}|\d+/g, 'N');
    a.push(`${name}=${v}`);
  }
  a.sort();
  const out = [`${'  '.repeat(depth)}<${node.tagName.toLowerCase()} ${a.join(' ')}>`];
  for (const c of node.childNodes) out.push(...canon(c, depth + 1));
  return out;
}
const parse = (html) => { const t = document.createElement('template'); t.innerHTML = html; return t.content; };
const lines = (html, strip) => { const f = parse(html); if (strip) f.querySelectorAll(strip).forEach((e) => (e.innerHTML = '')); return [...f.childNodes].flatMap((n) => canon(n)); };
function firstDiff(a, b) {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return { at: i, mine: a[i] ?? '(missing)', theirs: b[i] ?? '(missing)', ctx: a.slice(Math.max(0, i - 2), i).join('\n') };
  return null;
}
/* The engineer's page, parsed by the browser's own HTML5 parser (identical to what the live site's DOM looks like). */
async function engineerBlocks() {
  const doc = new DOMParser().parseFromString(await (await fetch('source/blocks.html')).text(), 'text/html');
  const top = [...doc.querySelectorAll('section.acf-section')].filter((s) => !s.parentElement.closest('section.acf-section'));
  const clean = (s) => { const c = s.cloneNode(true); c.querySelectorAll('section.acf-section, footer, #speedbump_modal, #backToTop, script').forEach((e) => e.remove()); return c.outerHTML; };
  return { block: (i) => clean(top[i]), header: doc.querySelector('header').outerHTML, footer: doc.querySelector('footer').outerHTML };
}
export async function run(ordered, demo) {
  tokenHex();
  const theirs = await engineerBlocks();
  const results = [];
  const jobs = ordered.map((i) => ({ id: String(i), mine: () => renderBlock(demo[i]), raw: () => theirs.block(i), type: demo[i].type }));
  jobs.push({ id: 'header', mine: () => siteHeader(header), raw: () => theirs.header, type: 'siteHeader' }, { id: 'footer', mine: () => siteFooter(footer), raw: () => theirs.footer, type: 'siteFooter' });
  for (const j of jobs) {
    const raw = j.raw();
    const strip = j.type === 'certificateCalculator' ? '#fin-cd-calculator' : j.type === 'rateTable' ? '.rates-table' : null; /* rates-table: Finalytics fills it client-side, static markup is empty */ /* engineer mount point is empty (vendor-injected widget) */
    const A = lines(j.mine(), strip), B = lines(raw, strip);
    const d = firstDiff(A, B);
    results.push({ id: j.id, type: j.type, ok: !d, lines: [A.length, B.length], diff: d });
  }
  window.__verify = results;
  const bad = results.filter((r) => !r.ok);
  const box = document.createElement('pre');
  box.style.cssText = 'position:fixed;z-index:99999;top:0;right:0;max-width:46vw;max-height:60vh;overflow:auto;background:#111;color:#0f0;font:11px/1.4 monospace;padding:10px;margin:0';
  box.textContent = `VERIFY ${results.length - bad.length}/${results.length} blocks match\n` + bad.map((r) => `FAIL ${r.id} ${r.type} @${r.diff.at}`).join('\n');
  document.body.appendChild(box);
  console.log('VERIFY', results.length - bad.length, '/', results.length);
}
