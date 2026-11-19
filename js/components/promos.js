import { section, layout, eyebrow, img, imageFit, cta, cx } from '../lib.js';

/* App Store / Google Play badges (store: 'apple' | 'google'). */
const STORE = { apple: ['Download on the', 'App Store', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.200-2.600-.1 0-2.400-.9-2.400-3.900zM14.100 5.800c.6-.8 1.100-1.800.9-2.800-.9 0-2 .6-2.600 1.400-.6.700-1.100 1.700-.9 2.700 1 .1 2-.5 2.600-1.300z"/></svg>'],
  google: ['GET IT ON', 'Google Play', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.500v19l10-9.500L4 2.500zm11.200 8.300L6.100 2.100l10.700 6.100-1.600 2.600zm0 2.400 1.600 2.600-10.700 6.100 9.100-8.700zm3.300-3.800-2 1.200-1.800-1.700 1.800-1.700 2 1.200c.9.500.9 1.500 0 1z"/></svg>'] };
export const badgeRow = (badges = []) => badges.length
  ? `<div class="store-badges">${badges.map((b) => { const [a, n, ic] = STORE[b.store] ?? STORE.apple; return `<a href="${b.href ?? '#'}" class="store-badge" aria-label="${a} ${n}">${ic}<span><small>${a}</small><strong>${n}</strong></span></a>`; }).join('')}</div>` : '';

/* Two overlapping phone mockups (pure HTML/CSS; frames use --color-highlight). Figma "Online Banking Phone": 724x606 group, front 280x606, rear 196x424 (same UI at 70%), stats cluster to the right. */
const tx = (name, date, amt, up) => `<li><i class="${up ? 'up' : ''}"></i><span><b>${name}</b><em>${date}</em></span><strong class="${up ? 'pos' : ''}">${amt}</strong></li>`;
const screen = () => `<div class="scr"><div class="ph-top"><div><b><sup>$</sup>6,890</b><small>June earning</small></div><span class="ph-av"><i></i><u></u></span></div>
  <div class="ph-tabs"><span class="on">Week</span><span>Month</span><span>Year</span></div>
  <p class="ph-h">Upcoming Bills</p>
  <div class="ph-bills"><div class="bill"><small>22 JUNE 2026</small><div class="bill-in"><span><em>Evernote</em><b>$12.50</b></span><i class="go"></i></div></div><div class="bill alt"><small>10 JULY 2026</small><div class="bill-in"><span><em>DirecTV</em><b>$88.90</b></span></div></div></div>
  <p class="ph-h">Week Transactions</p><ul>${tx('App Met', '13.06.2026', '68.05')}${tx('Target', '10.06.2026', '102.91')}${tx('Credit 11045', '10.06.2026', '150.00', true)}</ul></div>`;
export const phoneMock = () => `<div class="phones" aria-hidden="true">
  <div class="phone phone-back">${screen()}</div>
  <div class="phone phone-front">${screen()}</div>
  <div class="stat stat-a"><span class="ring">20%</span><span><b>Monthly Stats</b><small>+20 better performance</small></span></div>
  <div class="stat stat-b"><small>Earning</small><b><sup>$</sup> 10,221</b></div><div class="stat stat-c"><small>Spending</small><b><sup>$</sup> 3,986</b></div></div>`;

/* Promo  (ACF: promo-product | promo-split | promo-offset | promo-full), each with `reverse`.
   props: variant, reverse, bg, brandDark (brand-colour background + light text), edge (image flush to the viewport edge, 50/50), badges [{store,href}], phones (two overlapping phone mockups instead of an image), logo, eyebrow, title, body, buttons, image, nested (inside a tab)            */
export function promo(p = {}) {
  const { variant = 'split', reverse = false, bg = 'none', sectionBg = 'none', secSp, logo, eyebrow: e, title, body, buttons = [], image, nested = false,
          pt = 50, pb = 50, mt = 'none', mb = 'none', imageClass, brandDark = false, edge = false, badges = [], phones = false } = p;
  const fade = reverse ? 'fade-animate-right' : 'fade-animate-left';
  const inner = `<div class="container"><div class="row g-0 align-items-center ${reverse ? 'reverse' : ''}">
      <div class="promo-content ${fade}">${logo ? `<div class="promo-logo">${img(logo)}</div>` : ''}${eyebrow(e)}<h2>${title}</h2><p>${body}</p>${cta(buttons)}${badgeRow(badges)}</div>
      <div class="promo-image">${phones ? phoneMock() : imageFit(image, imageClass ? { class: imageClass } : {})}</div>
    </div></div>`;
  const mods = cx(brandDark && 'promo-brand-dark', edge && 'promo-edge');
  if (nested) return layout(`promo promo-${variant} ${mods}`.trim(), { spacing: false }, inner);
  return section({ bg: brandDark ? 'tertiary' : sectionBg, ...(secSp ?? {}), spacing: true }, layout(`promo promo-${variant} ${mods}`.trim(), { bg: brandDark ? 'none' : bg, pt, pb, mt, mb }, inner));
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
