import { section, layout, intro, cx } from '../lib.js';

/* Rich Text  (ACF: content-block) - open WYSIWYG area. */
export function richText(p = {}) {
  const { html = '', pt = 50, pb = 100, width = 11, bg = 'none' } = p;
  return section({ bg }, layout('content-block', { pt, pb }, `<div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-${width} "><div class="wysiwyg fade-animate">${html}</div></div></div></div>`));
}

/* Flexible Columns  (ACF: flexible-columns) - 1 to 4 equal columns. columns: [html] ; align: '' | 'center' | 'start' ... */
export function flexibleColumns(p = {}) {
  const { bg = 'surface', eyebrow: e, title, body, columns = [], align = '' } = p;
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, body }) +
    `<div class="layout">` + layout('flexible-columns', {}, `<div class="container"><div class="row fade-animate justify-content-${align}">${columns.map((c) => `<div class="colx">${c}</div>`).join('')}</div></div>`) + `</div>`);
}

/* Anchor Bar  (ACF: anchor-bar) - in-page jump links. links: [{label, href}] */
export function anchorBar(p = {}) {
  const { links = [] } = p;
  return section({}, layout('anchor-bar', { pt: 50, pb: 50 }, `<div class="container"><div class="row justify-content-center"><div class="col fade-animate-down"><ul class="anchor-bar-list">${links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul></div></div></div>`));
}

/* Breadcrumbs  (Yoast markup). crumbs: [{label, href}] last one is current */
export function breadcrumbs(p = {}) {
  const { crumbs = [] } = p;
  const last = crumbs[crumbs.length - 1];
  const head = crumbs.slice(0, -1).map((c) => `<span><a href="${c.href}">${c.label}</a></span> › `).join('');
  return section({}, `<div class="yoast-breadcrumbs"><span>${head}<span class="breadcrumb_last" aria-current="page">${last.label}</span></span></div>`);
}

/* Disclosures  (ACF: disclosures) - legal copy above the footer. */
export function disclosures(p = {}) {
  const { title = 'Disclosures', html = '' } = p;
  return section({}, layout('disclosures', { pt: 50, pb: 50 }, `<div class="container"><div class="row"><div class="col-12"><div class="disclosure-content fade-animate"><h6>${title}</h6>${html}</div></div></div></div>`));
}

/* Intro-only section  (ACF: intro - small / medium / large / boxed / boxed w/ background / boxed w/ border).
   props: eyebrow,title,body,icon,buttons, boxed + boxedStyle (e.g. "background-color:var(--color-dark);"), tone, bg, secBg, secSp, style */
export function introSection(p = {}) {
  const { secBg = 'none', secSp = {}, ...rest } = p;
  return section({ bg: secBg, ...secSp }, intro({ ...rest, bg: rest.bg ?? 'none' }));
}
