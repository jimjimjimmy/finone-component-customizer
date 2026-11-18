import { section, layout, eyebrow, img, cta, color, cx } from '../lib.js';

/* Feature Grid  (ACF: feature-grid)  - Feature Card Main + 2x2 / 3-col / vertical sub-items.
   props: bg (section tone), boxed + boxedBg (dark card), border:boolean (.with-border), layout:'grid'|'vertical',
          main {eyebrow,title,body,button}, items [{icon,title,text,link:{label,href,aria}}], tone:'light'|'dark'      */
export function featureGrid(p = {}) {
  const { bg = 'none', boxed = false, boxedBg = 'dark', border = false, layout: lay = 'grid', main = {}, items = [], tone, pt = 75, pb = 75, nested = false } = p;
  const wrap = !nested;
  const light = tone ? tone === 'light' : boxed;
  const item = (i) => `<div class="feature-grid-item item-stagger ${light ? 'text-light' : ''}">
    <div class="icon">${img(i.icon, { 'aria-hidden': 'true' })}</div><h3>${i.title}</h3><p>${i.text}</p>
    ${i.link ? `<a href="${i.link.href ?? '#'}" aria-label="${i.link.aria ?? ''}" class="">${i.link.label ?? 'Learn More'}</a>` : ''}</div>`;
  const inner = `<div class="container"><div class="row align-items-center ${boxed ? 'boxed' : ''}"${boxed ? ` style="background-color:${color(boxedBg)};"` : ''}>
      <div class="col-12 col-md-5 mb-5 mb-lg-0"><div class="feature-main-content fade-animate-left ${light ? 'text-light' : ''}">
        ${main.image ? `<div class="feature-image image-fit">${img(main.image)}</div>` : ''}${eyebrow(main.eyebrow)}<h2>${main.title}</h2><p>${main.body}</p>${main.button ? cta([main.button]) : ''}
      </div></div>
      <div class="col-12 col-md-7"><div class="${cx('feature-grid-items fade-animate-stagger', border && 'with-border', lay === 'vertical' && 'vertical-layout')}">${items.map(item).join('')}</div></div>
    </div></div>`;
  const block = layout('feature-grid', nested ? { spacing: false } : {}, inner);
  return wrap ? section({ pt, pb, bg }, block) : block;
}
