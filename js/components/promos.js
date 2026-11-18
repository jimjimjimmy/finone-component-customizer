import { section, layout, eyebrow, img, imageFit, cta, cx } from '../lib.js';

/* Promo  (ACF: promo-product | promo-split | promo-offset | promo-full), each with `reverse`.
   props: variant, reverse, bg, logo, eyebrow, title, body, buttons, image, nested (inside a tab)            */
export function promo(p = {}) {
  const { variant = 'split', reverse = false, bg = 'none', sectionBg = 'none', secSp, logo, eyebrow: e, title, body, buttons = [], image, nested = false,
          pt = 50, pb = 50, mt = 'none', mb = 'none', imageClass } = p;
  const fade = reverse ? 'fade-animate-right' : 'fade-animate-left';
  const inner = `<div class="container"><div class="row g-0 align-items-center ${reverse ? 'reverse' : ''}">
      <div class="promo-content ${fade}">${logo ? `<div class="promo-logo">${img(logo)}</div>` : ''}${eyebrow(e)}<h2>${title}</h2><p>${body}</p>${cta(buttons)}</div>
      <div class="promo-image">${imageFit(image, imageClass ? { class: imageClass } : {})}</div>
    </div></div>`;
  if (nested) return layout(`promo promo-${variant}`, { spacing: false }, inner);
  return section({ bg: sectionBg, ...(secSp ?? {}), spacing: true }, layout(`promo promo-${variant}`, { bg, pt, pb, mt, mb }, inner));
}

/* Banner  (ACF: banner-boxed | banner-full) - looping video with overlay copy.
   props: variant 'boxed'|'full', video, poster, logo, eyebrow, title, body, buttons, bg                          */
export function banner(p = {}) {
  const { variant = 'boxed', video, poster, logo, eyebrow: e, title, body, buttons = [], bg = 'none', id } = p;
  const boxed = variant === 'boxed';
  const inner = `<div class="${boxed ? 'container' : 'container-fluid g-0'}"><div class="row g-0 justify-content-center align-items-center fade-animate">
      <div class="banner-video"><video autoplay muted loop playsinline><source src="${video}" type="video/mp4"> Your browser does not support the video tag. </source></video>${img(poster)}</div>
      <div class="col-11 col-lg-8"><div class="banner-content text-center text-light">
        ${logo ? `<div class="banner-logo">${img(logo)}</div>` : ''}${eyebrow(e)}<h2>${title}</h2><p>${body}</p>${cta(buttons)}
      </div></div></div></div>`;
  return section(boxed ? { pt: bg === 'none' ? 'none' : 100, pb: 'none', bg, id } : { bg, id },
    layout(`banner banner-${variant}`, boxed ? { pb: 100 } : {}, inner));
}

/* Tabs  (ACF: tabs) - Bootstrap nav-tabs hosting nested blocks. panels: [{label, html}] */
export function tabs(p = {}) {
  const { panels = [], id = 'tabs-demo', pb = 100 } = p;
  const pid = (i) => panels[i].target ?? `tab-${i}-${id}`;
  return section({ pb },
    layout('tabs fade-animate-down', { pt: 75 },
      `<div class="container"><ul class="nav nav-tabs" id="${id}" role="tablist">${panels.map((t, i) => `<li class="nav-item" role="presentation"><button class="nav-link${i ? '' : ' active'}" id="${pid(i)}-tab" data-bs-toggle="tab" data-bs-target="#${pid(i)}" type="button" role="tab" aria-controls="${pid(i)}" aria-selected="${i ? 'false' : 'true'}">${t.label}</button></li>`).join('')}</ul>
      <div class="tab-content">${panels.map((t, i) => `<div class="tab-pane fade${i ? '' : ' show active'}" id="${pid(i)}" role="tabpanel" aria-labelledby="${pid(i)}-tab" tabindex="0">${t.html}</div>`).join('')}</div></div>`));
}
