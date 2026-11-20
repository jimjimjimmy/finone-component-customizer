import { rateTiles } from './rates.js';
import { section, layout, cta, eyebrow, img, imageFit, color, attrs, cx } from '../lib.js';

/* Hero  (ACF: hero-marquee | hero-large | hero-medium | hero-small | hero-boxed)
   props:
     size      'marquee' | 'large' | 'medium' | 'small'
     boxed     boolean   - contained card on a tinted section (large => .hlarge, others => .hsmall)
     tone      'light' | 'dark'   - text tone (light = white text, for dark backgrounds / image overlays)
     bg        tone name or CSS colour for the hero surface (token name: 'dark','surface','accent',...)
     rates     [tiles] - (fade only) integrated frosted rate row inside the hero
     panel     boolean  - (fade only) split layout: photo left, brand-colour copy panel right with the rate row beneath
     fade      boolean  - marquee only: gradient-fade variant (photo dissolves into the brand colour)
     overlay   0-100  marquee image overlay darkness (%)
     reverse   boolean  - image/content swap sides
     noImage   boolean  - small hero without a desktop image (centered text)
     image     src; eyebrow; title; body (html); buttons [{label,href,variant}]; id            */
export function hero(p = {}) {
  const { size = 'large', boxed = false, tone = 'light', bg = 'dark', overlay = 50, reverse = false, noImage = false,
          image, imageClass = 'attachment-full size-full', fade = false, panel = false, rates, eyebrow: e, title, body, buttons = [], id, align, bgColor } = p;
  const light = tone === 'light';
  const txt = (extra = '') => cx('hero-content', extra, light && 'text-light');
  const bgPos = 'background-position: center;background-size: cover;background-repeat: no-repeat;';

  if (boxed) {
    const sz = size === 'large' ? 'hlarge' : 'hsmall';
    const inner = `<div class="container"><div class="row justify-content-center">
      <div class="${txt(reverse ? 'fade-animate-right' : 'fade-animate-left')} ">
        ${eyebrow(e)}<h1>${title}</h1>${body ? `<p>${body}</p>` : ''}${cta(buttons, { align: 'start' })}
      </div>
      <div class="hero-picture"><div>${img(image)}</div></div>
    </div></div>`;
    return section({ pt: 50, pb: 50, bg, id },
      layout(`hero hero-boxed ${sz}${reverse ? ' reverse' : ''}`, { style: bgPos }, inner));
  }

  if (size === 'marquee' && fade) {   /* gradient-fade: photo dissolves at the bottom into --color-tertiary; left scrim keeps copy legible */
    const inner = `<div class="hero-picture">${imageFit(image, { class: imageClass })}</div>
      <div class="hero-fade-body"><div class="container g-0"><div class="row"><div class="col">
        <div class="${txt('fade-animate-left')}">${eyebrow(e)}<h1>${title}</h1>${body ? `<p>${body}</p>` : ''}${cta(buttons, { align: 'start' })}</div>
      </div></div></div>${rates?.length ? `<div class="hero-rates rate-cards rate-cards-frosted">${rateTiles(rates)}</div>` : ''}</div>`;
    return section({ id: id ?? 'customID' }, layout(`hero hero-marquee hero-fade${panel ? ' hero-panel' : ''}`, { bg: 'none', style: bgPos }, inner));
  }

  if (size === 'marquee') {
    const inner = `<div class="hero-picture overlay" style="--hero-overlay-opacity: ${overlay}%;">${imageFit(image, { class: imageClass })}</div>
      <div class="container g-0"><div class="row"><div class="col">
        <div class="${txt('fade-animate-down text-center')}">
          ${eyebrow(e)}<h1>${title}</h1>${body ? `<p>${body}</p>` : ''}${cta(buttons, { align: 'center' })}
        </div></div></div></div>`;
    return section({ id: id ?? 'customID' }, layout('hero hero-marquee', { bg: bg === 'dark' ? 'secondary' : bg, style: bgPos }, inner));
  }

  /* large / medium / small share one structure */
  const center = noImage || align === 'center';
  const rowCls = cx('row g-0 align-items-center', noImage && 'no-image justify-content-center');
  const pic = `<div class="${cx('hero-picture', noImage && 'hide-on-desktop')}">${imageFit(image, { class: imageClass })}</div>`;
  const content = `<div class="${txt(cx(center ? 'fade-animate-down text-center' : reverse ? 'fade-animate-right' : 'fade-animate-left'))}">
      ${eyebrow(e)}<h1>${title}</h1>${body ? `<p>${body}</p>` : ''}${cta(buttons, { align: center ? 'center' : 'start' })}
    </div>`;
  const surface = ['dark','surface','tint','secondary','tertiary','highlight','accent','white','none'].includes(bg);
  return section({ id },
    layout(`hero hero-${size}${reverse ? ' reverse' : ''}`,
      { bg: surface ? bg : 'none', style: [bgColor ? `background-color: ${color(bgColor)};` : !surface && bg ? `background-color: ${color(bg)};` : '', size === 'large' ? bgPos : ''].filter(Boolean).join('') || undefined },
      `<div class="container g-0"><div class="${rowCls}">${pic}${content}</div></div>`));
}
