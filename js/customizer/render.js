/* render.js - turns customizer state into one complete preview document (string). The preview iframe is rebuilt from
   this on every structural change, so the engineer's theme JS (Swiper, accordions, menus, fade-in) always initialises
   once on fresh markup and listeners can never be duplicated. Token/font changes bypass this (live CSS-variable binding). */
import { renderBlock, skipLinks, alertBar, siteHeader, siteFooter, speedbump } from '../blocks.js';
import { header as H, alert as A, footer as F } from '../demo/chrome.js';
import { themeCss, googleFontsHref, clone } from './theme.js';

const DEFAULT_ORG = 'Granite Credit Union';
const swapOrg = (obj, org) => JSON.parse(JSON.stringify(obj).split(DEFAULT_ORG).join(org.name).split('FinOne Financial Credit Union').join(org.name)
  .split('Routing #322484265').join(`Routing #${org.routing}`));

export function orgChrome(org) {
  const header = swapOrg(clone(H), org), footer = swapOrg(clone(F), org), alert = swapOrg(clone(A), org);
  footer.member.routing = `Routing # ${org.routing}`; footer.member.nmls = `NMLS: ${org.nmls}`;
  if (!org.logo) { header.logo = { href: header.logo.href, wordmark: org.name }; footer.logo = { href: footer.logo.href, wordmark: org.name }; }
  if (org.logo) { header.logo = { ...header.logo, src: org.logo, alt: org.name, width: undefined, height: undefined }; footer.logo = { ...footer.logo, src: org.logo, alt: org.name, width: undefined, height: undefined }; }
  return { header, footer, alert };
}

/* Apply brand assets / org copy to one block's props (clone) before rendering. */
export function blockProps(b, org) {
  const props = swapOrg(clone(b.props), org);
  if (org.heroImage && b.type === 'hero') props.image = org.heroImage;
  if (org.promoImage && b.type === 'promo') props.image = org.promoImage;
  return props;
}
const withUid = (html, uid) => html.replace(/^(\s*<section)/, `$1 data-uid="${uid}"`);

export function renderMain(state) {
  const vis = state.stack.filter((b) => !b.hidden);
  const html = vis.map((b) => {
    const props = blockProps(b, state.org);
    if (b.type === 'tabs') props.panels = props.panels.map((p) => ({ ...p, block: { ...p.block, props: swapOrg(p.block.props, state.org) } }));
    return { html: withUid(renderBlock({ type: b.type, props }), b.uid), fade: b.type === 'hero' && !!props.fade, dark: b.type === 'promo' && !!props.brandDark };
  });
  /* gradient-fade hero directly followed by a brand-dark promo: share one photo backdrop that dissolves into the brand colour behind the phones */
  const out = [];
  for (let i = 0; i < html.length; i++) {
    if (html[i].fade && html[i + 1]?.dark) { out.push(`<div class="l02-backdrop">${html[i].html}\n${html[i + 1].html}</div>`); i++; }
    else out.push(html[i].html);
  }
  return out.join('\n');
}

const PREVIEW_CSS = `[data-uid]{cursor:pointer}body.edit [data-uid].is-selected{outline:3px solid #2684ff;outline-offset:-3px;position:relative}
body.edit [data-uid]:hover:not(.is-selected){outline:2px dashed rgba(38,132,255,.55);outline-offset:-2px}html{scroll-behavior:auto!important}`;
const PREVIEW_JS = `document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(a&&!a.closest('.nav-tabs'))e.preventDefault();
var s=e.target.closest('[data-uid]');if(s&&document.body.classList.contains('edit'))parent.postMessage({type:'select',uid:s.dataset.uid},'*');},true);`;

const BUST = Date.now();   /* per page-load cache bust for local stylesheets (edits show on reload) */
export function buildDoc(state) {
  const { header, footer, alert } = orgChrome(state.org);
  const fonts = googleFontsHref(state.theme.fonts);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="vendor/bootstrap.css?v=${BUST}"><link rel="stylesheet" href="vendor/fa-all.min.css"><link rel="stylesheet" href="vendor/ubermenu.min.css"><link rel="stylesheet" href="vendor/tablepress.css">
<link rel="stylesheet" href="tokens.css?v=${BUST}"><link rel="stylesheet" href="blocks.css?v=${BUST}"><link rel="stylesheet" href="calculator.css?v=${BUST}"><link rel="stylesheet" href="wordmark.css?v=${BUST}"><link rel="stylesheet" href="fullbleed.css?v=${BUST}"><link rel="stylesheet" href="variants.css?v=${BUST}">
<link id="gf" rel="stylesheet" href="${fonts}"><style id="theme-vars">${themeCss(state.theme)}</style><style>${PREVIEW_CSS}</style></head>
<body class="blocks-kitchen-sink${state.controlsHidden ? '' : ' edit'}"><div class="site-overlay-dark"></div>${skipLinks()}
<div id="page" class="site${state.template === 'layout02' ? ' l02' : ''}">${state.showAlert === false ? '' : alertBar(alert)}${siteHeader(header)}<main id="primary" class="site-main">${renderMain(state)}</main>${siteFooter(footer)}</div>${speedbump({ owner: state.org.name })}
<script>window.wp_ajax={ajaxurl:'#',swiperUrl:'./swiper.min.js'};</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="vendor/main.min.js"></script>
<script type="module">import { wireCertificateCalculator } from './js/components/calculator.js'; wireCertificateCalculator();</script>
<script>${PREVIEW_JS}</script></body></html>`;
}
