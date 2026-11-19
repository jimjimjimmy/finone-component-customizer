import { section, layout, cta, eyebrow, img, intro, button, cx } from '../lib.js';
import { SWIPER_PREV, SWIPER_NEXT } from '../svg.js';

const controls = () => `<div class="swiper-button-prev">${SWIPER_PREV}</div><div class="swiper-pagination"></div><div class="swiper-button-next">${SWIPER_NEXT}</div>`;

/* Featured Rate Strip  (ACF: rate-cards)  appearance 'default' | 'frosted' (brand-dark strip, translucent cards)  - Checking / Home Loans / Certificates / Auto Loans ...
   tiles: [{ icon, title, href?, text? | rate:{ value, unit:'%', label:'APY', lead:'24 months' }, cta:{label,href} }]  */
export function rateCards(p = {}) {
  const { tiles = [], buttons = [], id, appearance = 'default' } = p;
  const frosted = appearance === 'frosted';
  const card = (t) => `<div class="card item-stagger swiper-slide item-stagger">
    <div class="card-header">${img(t.icon, { 'aria-hidden': 'true' })}${t.href ? `<a href="${t.href}">${t.title}</a>` : ' ' + t.title + ' '}</div>
    <div class="card-body">${t.rate
      ? ` ${t.rate.lead} <div class="rate-group"><div class="div1">${t.rate.value}</div><div class="div2">${t.rate.unit ?? '%'}</div><div class="div3">${t.rate.label}<sup>*</sup></div></div>`
      : `<div class="card-text"> ${t.text} </div>`}</div>
    <div class="card-footer"><a href="${t.cta.href ?? '#'}" class="btn btn-primary-dark">${t.cta.label}</a></div>
  </div>`;
  const strip = layout(cx('rate-cards', frosted && 'rate-cards-frosted'), { pb: 50 },
    `<div class="container"><div class="row"><div class="rate-tiles fade-animate-stagger"><div class="swiper swiper-rate-cards"><div class="swiper-wrapper">${tiles.map(card).join('')}</div>${controls()}</div></div></div></div>`);
  const more = buttons.length
    ? layout('buttons-group', {}, `<div class="container"><div class="row"><div class="col-12 fade-animate-down">${cta(buttons, { align: 'center' })}</div></div></div>`) : '';
  return section({ pt: 50, pb: 50, id, ...(frosted ? { bg: 'tertiary' } : {}) }, strip + more);
}

/* Rate Table  (ACF: intro + rates)  - Savings / Checking rate tables.
   name: finalytics table id; columns: [..]; rows: [[..]]; learn:{label,href}; open:{label,href} */
export function rateTable(p = {}) {
  const { bg = 'surface', title, body, name = 'regular_savings', columns = [], rows = [], learn, open, pt = 50, pb = 50 } = p;
  const head = intro({ eyebrow: '', title, body, align: 'start', width: 10, pb: 50, pt: undefined, mt: 'none', mb: 'none' });
  const table = `<table><thead><tr>${columns.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const ctas = `<div class="table-ctas"><div>${learn ? `<a href="${learn.href ?? '#'}" class="btn btn-text">${learn.label}</a>` : ''}</div><div>${open ? cta([{ ...open, variant: 'primary' }]) : ''}</div></div>`;
  return section({ pt, pb, bg }, head + layout('rates', {}, `<div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-10"><div class="rates-table" data-table-name="${name}">${table}</div>${ctas}</div></div></div>`));
}
