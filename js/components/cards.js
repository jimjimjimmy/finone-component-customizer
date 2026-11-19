import { section, layout, eyebrow, img, cta, intro, cx } from '../lib.js';

const stagger = (n) => (n ? ` cards-count-${n}` : '');

/* Action Cards  (ACF: cards > .action_card) - two-button feature cards.
   cards: [{eyebrow,title,body,buttons}]                                                                     */
export function actionCards(p = {}) {
  const { eyebrow: e, title, body, cards = [], bg = 'none' } = p;
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, body, width: 8 }) +
    layout('cards', { pb: 'none', pt: undefined, spacing: true, extra: '' },
      `<div class="container"><div class="row fade-animate-stagger${stagger(cards.length)}">${cards.map((c) => `<div class="card-wrapper item-stagger"><div class="card action_card">
        <div class="card-body">${eyebrow(c.eyebrow)}<h3 class="card-title">${c.title}</h3><p>${c.body}</p></div>
        <div class="card-footer">${cta(c.buttons)}</div></div></div>`).join('')}</div></div>`));
}

/* Promo Cards  (ACF: promo-cards) - image-led two-up cards. cards: [{eyebrow,title,body,button,image}]           */
export function promoCards(p = {}) {
  const { title, body, cards = [], bg = 'surface', cols = 2 } = p;
  const col = cols === 3 ? 'col-12 col-md-6 col-lg-4' : 'col-12 col-md-6';
  return section({ pt: 75, pb: 75, bg },
    (title || body ? intro({ eyebrow: '', title, body, width: 8 }) : '') +
    layout(cols === 3 ? 'promo-cards promo-cards-3' : 'promo-cards', {}, `<div class="container"><div class="row fade-animate-stagger">${cards.map((c) => `<div class="${col} item-stagger"><div class="card promo-card">
      <div class="card-body"><p class="eyebrow">${c.eyebrow}</p><h3>${c.title}</h3> ${c.body} ${cta([c.button], { align: 'center' })}</div>
      <div class="card-image">${img(c.image)}</div></div></div>`).join('')}</div></div>`));
}

/* Product Cards  (ACF: cards.get-products) - icon + copy + link. noBorder, nested (inside tabs).
   cards: [{icon,eyebrow?,title,body,link:{label,href,aria}}]                                                    */
export function productCards(p = {}) {
  const { bg = 'accent', eyebrow: e, title, cards = [], noBorder = true, nested = false } = p;
  const grid = `<div class="container"><div class="row fade-animate-stagger${stagger(cards.length)}">${cards.map((c) => `<div class="card-wrapper item-stagger"><div class="card">
      <div class="card-icon">${img(c.icon, { 'aria-hidden': 'true' })}</div>
      <div class="card-body">${c.eyebrow ? eyebrow(c.eyebrow) : ''}<h3>${c.title}</h3><p></p><p>${c.body}</p><p></p></div>
      <div class="card-footer"><a href="${c.link.href ?? '#'}" class="btn btn-link-dark" aria-label="${c.link.aria ?? ''}">${c.link.label}</a></div></div></div>`).join('')}</div></div>`;
  if (nested) return layout('cards get-products', { spacing: false }, grid);
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, tone: bg === 'none' || bg === 'surface' ? undefined : 'light' }) +
    layout(`cards get-products${noBorder ? ' no-border' : ''}`, { extra: noBorder ? 'no-border' : '' }, grid));
}

/* Static Cards  (ACF: cards > with_image | with_icon | simple_card), with or without buttons.
   cards: [{type:'image'|'icon'|'simple', image|icon, title, body, button?}]; footer buttons row optional.        */
export function staticCards(p = {}) {
  const { bg = 'none', eyebrow: e, title, body, cards = [], buttons = [], count = cards.length } = p;
  const card = (c) => {
    const cls = { image: 'with_image', icon: 'with_icon', simple: 'simple_card' }[c.type ?? 'simple'];
    const media = c.type === 'image' ? `<div class="card-image image-fit">${img(c.image, { class: 'card-img-top' })}</div>`
      : c.type === 'icon' ? `<div class="card-icon">${img(c.icon, { class: 'card-img-top', 'aria-hidden': 'true' })}</div>` : '';
    return `<div class="card-wrapper item-stagger"><div class="card ${cls}">${media}<div class="card-body"><h3 class="card-title">${c.title}</h3><p>${c.body}</p></div>${c.button ? `<div class="card-footer">${cta([c.button])}</div>` : ''}</div></div>`;
  };
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, body, id: 'introID' }) +
    layout('cards', {}, `<div class="container"><div class="row fade-animate-stagger${stagger(count)}">${cards.map(card).join('')}</div></div>`) +
    (buttons.length ? layout('buttons-group', {}, `<div class="container"><div class="row"><div class="col-12 fade-animate-down">${cta(buttons, { align: 'center' })}</div></div></div>`) : ''));
}

/* Curated Blog / News grid  (ACF: cards.get-posts)  posts: [{image,eyebrow,title,href,excerpt,cta}] */
export function postCards(p = {}) {
  const { bg = 'surface', eyebrow: e, title, body, posts = [], noBorder = false, buttons = [], tone } = p;
  const card = (x) => `<div class="card-wrapper item-stagger"><div class="card"><div class="card-image image-fit">${img(x.image)}</div>
    <div class="card-body">${eyebrow(x.eyebrow)}<h3><a href="${x.href ?? '#'}">${x.title}</a></h3><p>${x.excerpt}</p></div>
    <div class="card-footer"><a href="${x.href ?? '#'}" class="btn btn-link-dark">${x.cta ?? 'Read more'}</a></div></div></div>`;
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow: e, title, body, tone }) +
    layout(`cards get-posts${noBorder ? ' no-border' : ''}`, {}, `<div class="container"><div class="row fade-animate-stagger">${posts.map(card).join('')}</div></div>`) +
    (buttons.length ? layout('buttons-group', {}, `<div class="container"><div class="row"><div class="col-12 fade-animate-down">${cta(buttons, { align: 'center' })}</div></div></div>`) : ''));
}

/* Mix-and-Match  (ACF: get-post) - hand-picked pages & posts. items: [{image,title,body,href,cta}] */
export function mixMatch(p = {}) {
  const { bg = 'tertiary', eyebrow: e, title, body, items = [], buttons = [], sectionStyle } = p;
  const card = (x) => `<div class="card-wrapper item-stagger"><div class="card"><div class="card-image image-fit">${img(x.image, { alt: x.title })}</div>
    <div class="card-body"><h3 class="card-title">${x.title}</h3><p>${x.body ?? ''}</p></div>
    <div class="card-footer"><a href="${x.href ?? '#'}" class="btn btn-link-dark"${x.aria ? ` aria-label="${x.aria}"` : ''}>${x.cta}</a></div></div></div>`;
  return section({ pt: 100, pb: 100, bg, style: sectionStyle },
    intro({ eyebrow: e, title, body, tone: 'light' }) +
    layout('get-post', { pt: 50, pb: 25 }, `<div class="container"><div class="row fade-animate-stagger">${items.map(card).join('')}</div></div>`) +
    (buttons.length ? layout('buttons-group', {}, `<div class="container"><div class="row"><div class="col-12 fade-animate-down">${cta(buttons, { align: 'center' })}</div></div></div>`) : ''));
}
