import { section, layout, intro, img, cta, eyebrow, cx } from '../lib.js';
import { SWIPER_PREV, SWIPER_NEXT } from '../svg.js';

/* Comparison Table  (ACF: compare-table-block).
   columns: [{name, sub, blurb, button}]; rows: [{label, cells:[text | {check:true} | '']}]; lead cells in row 1 = tagline per column  */
export function compareTable(p = {}) {
  const { bg = 'surface', eyebrow: e, title, body, columns = [], taglines = [], rows = [], check } = p;
  const th = (c) => `<th class="column-${columns.indexOf(c) + 2}"><strong>${c.name}</strong><br> ${c.sub}<br><div class="small">${c.blurb}</div></th>`;
  const cell = (v, i) => `<td class="column-${i + 2}">${v && v.check ? img(check, { loading: 'lazy', decoding: 'async', width: 25, height: 18, class: 'alignnone size-medium wp-image-2326', role: 'img' }) : (v ?? '')}</td>`;
  const table = `<table id="tablepress-1" class="tablepress tablepress-id-1 compare-table"><thead><tr class="row-1"><td class="column-1"></td>${columns.map(th).join('')}</tr></thead>
    <tbody><tr class="row-2"><td class="column-1"></td>${taglines.map(cell).join('')}</tr>
    ${rows.map((r, n) => `<tr class="row-${n + 3}"><th class="column-1">${r.label}</th>${r.cells.map(cell).join('')}</tr>`).join('')}</tbody>
    <tfoot><tr class="row-${rows.length + 3}"><td class="column-1"></td>${columns.map((c, i) => `<th class="column-${i + 2}">${c.button ? `<a href="${c.button.href ?? '#'}" class="btn btn-primary">${c.button.label}</a>` : ''}</th>`).join('')}</tr></tfoot></table>`;
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, body }) +
    layout('compare-table-block', {}, `<div class="container"><div class="row"><div class="col-12 fade-animate"><wa-scrollbar axis="horizontal" show="always" aria-label="Compare Table">${table}</wa-scrollbar></div></div></div>`));
}

/* Steps  (ACF: steps)  variant 'number' | 'icon' | 'image'.  steps: [{title, body, icon|image}] */
export function steps(p = {}) {
  const { variant = 'number', bg = 'none', eyebrow: e, title, body, steps: list = [], pt = 100, pb = 100 } = p;
  const media = (s, i) => variant === 'number' ? `<div class="step-num"><span>${i + 1}</span></div>`
    : variant === 'icon' ? `<div class="step-icon">${img(s.icon, { 'aria-hidden': 'true' })}</div>` : `<div class="step-img">${img(s.image)}</div>`;
  return section({ bg, style: 'background-position: center;background-size: cover;background-repeat: no-repeat;' },
    intro({ eyebrow: e, title, body, width: 8, pt: variant === 'number' ? 100 : 100, pb: 50, mb: 25 }) +
    layout('steps', { pb }, `<div class="container"><div class="row g-0"><div class="steps-wrap fade-animate-stagger steps-${list.length}">${list.map((s, i) => `<div class="step item-stagger">${media(s, i)}<div class="step-content"><h3>${s.title}</h3><p>${s.body}</p></div></div>`).join('')}</div></div></div>`));
}

/* Logo / Awards Grid  (ACF: logo-grid)  logos: [{src, href, label, host}] */
export function logoGrid(p = {}) {
  const { bg = 'surface', eyebrow: e, title, logos = [] } = p;
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title }) +
    layout('logo-grid', {}, `<div class="container"><div class="row"><div class="col"><div class="logo-grid-wrapper fade-animate-stagger">${logos.map((l) => `<div class="logo-grid-item item-stagger">${l.href ? `<a href="${l.href}" target="" alt="${l.host ?? ''}" aria-label="${l.label}">${img(l.src)}</a>` : img(l.src)}</div>`).join('')}</div></div></div></div>`));
}

/* Quotes - "What's the Word"  (ACF: blockquote, Swiper slider).  variant 'plain' | 'boxed'
   slides: [{quote, by}]  Slide = one blockquote; the engineer's markup uses one <p> + one footer per slide. */
export function quotes(p = {}) {
  const { variant = 'plain', bg = 'accent', eyebrow: e, title, slides = [], boxedBg = 'dark' } = p;
  const swiper = `<!-- Slider main container --><div class="swiper fade-animate"><div class="swiper-wrapper">${slides.map((s) => `<div class="swiper-slide"><blockquote><p>${s.quote}</p><div class="blockquote-footer"> ${s.by} </div></blockquote></div>`).join('')}</div>
      <div class="swiper-controls"><div class="swiper-button-prev">${SWIPER_PREV}</div><div class="swiper-pagination"></div><div class="swiper-button-next">${SWIPER_NEXT}</div></div></div>`;
  if (variant === 'boxed')
    return section({}, layout('blockquote', { pt: 75, pb: 75 }, `<div class="container"><div class="row justify-content-center boxed bg${boxedBg === 'dark' ? 'Denim' : boxedBg}"><div class="col-12 col-lg-10 text-light">${swiper}</div></div></div>`));
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, width: 8, tone: 'light' }) +
    layout('blockquote', {}, `<div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-10 text-light">${swiper}</div></div></div>`));
}

/* FAQ Accordion  (ACF: faqs, Bootstrap collapse).  items: [{q, a(html)}] */
export function faq(p = {}) {
  const { bg = 'none', eyebrow: e, title, body, items = [], idBase = 817 } = p;
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, body, width: 8 }) +
    layout('faqs', {}, `<div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-11"><div class="accordion fade-animate-stagger">${items.map((it, i) => {
      const n = idBase + i;
      return `<div class="accordion-item item-stagger"><button id="heading-${n}" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${n}" aria-expanded="false" aria-controls="collapse-${n}"><div class="plusminus"></div> ${it.q} </button>
        <div id="collapse-${n}" class="accordion-collapse collapse" aria-labelledby="heading-${n}"><div class="accordion-body"> ${it.a} </div></div></div>`;
    }).join('')}</div></div></div></div>`));
}
