import { section, layout, intro } from '../lib.js';

/* Quicklinks  (ACF: intro + quicklinks)
   props: items [{icon,title,text?,href?}], link:boolean (false = no-link option, <div class="ql-item">),
          descriptions:boolean, eyebrow/title (intro), bg                                             */
export function quicklinks(p = {}) {
  const { bg = 'none', eyebrow, title, items = [], link = true, descriptions = false, target = '_self' } = p;
  const li = (i) => {
    const body = `<img src="${i.icon}" alt="" aria-hidden="true"><h3>${i.title}</h3>${descriptions && i.text ? `<p>${i.text}</p>` : ''}`;
    return `<li class="item-stagger">${link ? `<a class="ql-item" href="${i.href ?? '#'}" target="${target}">${body}</a>` : `<div class="ql-item">${body}</div>`}</li>`;
  };
  return section({ pt: 100, pb: 100, bg },
    intro({ eyebrow, title, align: 'center', width: 10 }) +
    layout('quicklinks', {}, `<div class="container"><div class="row"><ul class="quicklinks-list fade-animate-stagger" data-count="${items.length}">${items.map(li).join('')}</ul></div></div>`));
}
