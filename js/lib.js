/* lib.js - shared helpers. Every component is a pure function: props in, HTML string out.
   Class names and DOM hierarchy are the engineer's (ACF blocks, finone.finalytics.ai/blocks). */

/* Brand-agnostic tone -> engineer background utility class. */
export const BG = {
  none: 'noBg', white: 'bgWhite', surface: 'bgGray', accent: 'bgSunset', dark: 'bgDenim',
  secondary: 'bgSky', tint: 'bgGranite', tertiary: 'bgHaze', highlight: 'bgField',
};
export const bgClass = (b) => BG[b] ?? b ?? 'noBg';

/* Inline-style colour: accepts a token name ("accent") or any CSS colour. */
const TOKENS = ['accent','accent-dark','dark','secondary','tint','tertiary','tertiary-light','highlight','surface','white','black'];
export const color = (c) => (TOKENS.includes(c) ? `var(--color-${c})` : c);

export const attrs = (o = {}) =>
  Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${String(v).replace(/"/g, '&quot;')}"`)).join('');

export const cx = (...a) => a.flat().filter(Boolean).join(' ');

/* ---- Spacing / surface overrides ------------------------------------------------------------------------------
   Each ACF block carries pt/pb/mt/mb + bg utility classes on its <section> and on every inner .layout.  Components ship
   sensible defaults; any page can override them per block with the `spacing` prop:
     spacing: { section:{pt,pb,mt,mb,bg,id,style}, intro:{...}, layouts:{ 'quicklinks':{...}, 'buttons-group':{...} } }
   values: 'none' | 25 | 50 | 75 | 100 | false (omit the class).  renderBlock() applies it for the duration of one render. */
let SP = null;
export const withSpacing = (sp, fn) => { const prev = SP; SP = sp ?? null; try { return fn(); } finally { SP = prev; } };
const sp4 = (p) => ['pt', 'pb', 'mt', 'mb'].map((k) => (p[k] === false ? '' : `${k}-${p[k] ?? 'none'}`));
const bgOf = (b) => (b === false ? '' : bgClass(b ?? 'none'));

/* <section class="acf-section ..."> wrapper. */
export function section(p = {}, inner = '') {
  const m = { ...p, ...(SP?.section ?? {}) };
  const { bg = 'none', id, style } = m;
  const noSp = m.spacing === false;
  return `<section class="${cx('acf-section', noSp ? '' : sp4(m), noSp && bg === 'none' ? '' : bgOf(bg))}"${attrs({ id, style })}>${inner}</section>`;
}

/* <div class="layout <name> ..."> */
export function layout(name, p = {}, inner = '') {
  const m = { ...p, ...(SP?.layouts?.[name.split(' ')[0]] ?? {}) };
  const { bg = 'none', extra = '', id, style } = m;
  const noSp = m.spacing === false;
  return `<div class="${cx('layout', name, extra, noSp ? '' : sp4(m), noSp && bg === 'none' ? '' : bgOf(bg))}"${attrs({ id, style })}>${inner}</div>`;
}

export const eyebrow = (t) => `<div class="eyebrow">${t ?? ''}</div>`;

/* Buttons. variant: primary|secondary|tertiary|text|primary-dark|primary-white|secondary-white|text-dark|text-light|link-dark */
export const button = (b) => {
  const { label, href = '#', variant = 'primary', target, aria, id, small } = b;
  return `<a href="${href}" class="${cx('btn', `btn-${variant}`, small && 'small')}" role="button"${attrs({ target, 'aria-label': aria, id })}> ${label} </a>`;
};
export const cta = (buttons = [], { align = '' } = {}) =>
  buttons.length
    ? `<div class="cta-group"><div class="flex-buttons ${align ? 'justify-content-' + align : ''}">${buttons.map(button).join('')}</div></div>`
    : '';

export const img = (src, a = {}) => `<img${attrs({ src, alt: '', ...a })}>`;
export const imageFit = (src, a = {}) => `<div class="image-fit">${img(src, a)}</div>`;

/* Intro: eyebrow / heading / body / buttons. */
export function intro(p = {}) {
  const { eyebrow: e, title, body, buttons, icon, align = 'center', width = 10, tone, bg = 'none', pt = 'none', pb = 50, mt, mb,
          boxed, boxedStyle, fade = true, spacing, id, extra, style } = p;
  const col = `<div class="${cx('col-12', `col-lg-${width}`, `text-${align}`, tone === 'light' && 'text-light')} ">
    ${icon ? `<div class="icon">${img(icon, { alt: '' })}</div>` : ''}
    ${p.eyebrowEmpty !== false || e ? eyebrow(e) : ''}
    ${title ? `<h2>${title}</h2>` : ''}${body != null ? `<p>${body}</p>` : ''}${cta(buttons, { align: align === 'center' ? 'center' : '' })}
  </div>`;
  const row = boxed
    ? `<div class="row justify-content-center boxed"${attrs({ style: boxedStyle })}>${col}</div>`
    : `<div class="row justify-content-center">${col}</div>`;
  return layout('intro', { bg, pt, pb, mt, mb, spacing, id, extra, style, ...(SP?.intro ?? {}) }, `<div class="container${fade && !boxed ? ' fade-animate-down' : ''}">${row}</div>`);
}

/* Heading block above a block (the engineer pairs `intro` + content in one section). */
export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-');
