import { img, attrs, cx, button } from '../lib.js';

/* Text wordmark used when a brand supplies no logo file: monogram + name, styled by tokens (wordmark.css). */
export function wordmark(name) {
  const words = String(name).trim().split(/\s+/), initials = words.filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  return `<span class="custom-logo wordmark" role="img" aria-label="${esc(name)}"><span class="wm-mark" aria-hidden="true">${esc(initials)}</span><span class="wm-name" aria-hidden="true"><strong>${esc(words[0])}</strong>${words.length > 1 ? `<span>${esc(words.slice(1).join(' '))}</span>` : ''}</span></span>`;
}

/* ---------- Skip links + site alert ---------- */
export const skipLinks = () => `
<a class="screenreader-text d-none d-lg-block" href="#desktopLogin">Skip to Login</a>
<a class="screenreader-text d-none d-lg-block" href="#btnAccount">Skip to Open Account</a>
<a class="screenreader-text d-none d-lg-block" href="#site-navigation">Skip to Navigation</a>
<a class="screenreader-text d-block d-lg-none" href="#mobileLogin">Skip to Login</a>
<a class="screenreader-text d-block d-lg-none" href="#nav-dash">Skip to Navigation</a>
<a class="screenreader-text" href="#primary">Skip to Content</a>`;

/* tone: 'secondary' (engineer: site-alert-secondary). */
export const alertBar = ({ tone = 'secondary', title, text, id = 'site-alert-1' } = {}) =>
  `<div id="${id}" class="alert site-alert site-alert-${tone}" role="alert"><div class="container"><div class="row"><div class="col-12">
   <span class="alert-title">${title}</span><p>${text}</p><button class="btn-close-alert" aria-label="Close Alert" type="button"></button></div></div></div></div>`;

/* ---------- Header ----------
   props:
     logo     {src, alt, href}
     utility  [{label, href, kind?:'login'|'account', children?:[{label,href}]}]    top utility bar
     nav      [{label, href?, columns?:[{title, links:[{label,href}]}], promo?:{image,title,text,cta:{label,href}}}]   main nav (mega menu)
     search   {popular:[{label,href}], icon}
     login    {register:{label,href}, forgot:{label,href}}
     mobile   {menu:[{label,href,children?}], account:[{label,href}], toolbar:[{label,href}]}                   */
let uid = 1000;
const wpItem = (li, extra = '') => { const n = ++uid; return `<li id="menu-item-${n}" class="${cx(extra, `menu-item menu-item-type-${li.wpType ?? 'custom'} menu-item-object-${li.wpObject ?? 'custom'}`, li.children && 'menu-item-has-children', `menu-item-${n}`)}">`; };
const wpList = (items) => items.map((i) => `${wpItem(i, i.kind ? `btn-${i.kind}` : '')}<a href="${i.href ?? '#'}">${i.label}</a>${i.children ? `<ul class="sub-menu">${i.children.map((c) => `${wpItem(c)}<a href="${c.href ?? '#'}">${c.label}</a></li>`).join('')}</ul>` : ''}</li>`).join('');

const uberLink = (l) => `<a class="ubermenu-target ubermenu-item-layout-default ubermenu-item-layout-text_only" href="${l.href ?? '#'}"><span class="ubermenu-target-title ubermenu-target-text">${l.label}</span></a>`;
const uli = (n) => `id="menu-item-${n}" `;
const uberLeaf = (l) => `<li ${uli(uid + 1)}class="ubermenu-item ubermenu-item-type-${l.wpType ?? 'custom'} ubermenu-item-object-${l.wpObject ?? 'custom'} ubermenu-item-${++uid} ubermenu-item-auto ubermenu-item-normal ubermenu-item-level-9 ubermenu-column ubermenu-column-auto">${uberLink(l)}</li>`;
const uberGroup = (g) => `<li ${uli(uid + 1)}class="ubermenu-item ubermenu-item-type-custom ubermenu-item-object-custom ubermenu-item-has-children ubermenu-item-${++uid} ubermenu-item-auto ubermenu-item-normal ubermenu-item-level-7 ubermenu-column ubermenu-column-auto ubermenu-has-submenu-stack">${uberLink(g)}<ul class="ubermenu-submenu ubermenu-submenu-id-${++uid} ubermenu-submenu-type-auto ubermenu-submenu-type-stack">${g.links.map(uberLeaf).join('')}</ul></li>`;
const uberCol = (c, lvl, cls) => `<li class="ubermenu-item ubermenu-item-type-custom ubermenu-item-object-ubermenu-custom ubermenu-item-has-children ubermenu-item-${++uid} ubermenu-item-level-${lvl} ubermenu-column ubermenu-column-${cls} ubermenu-has-submenu-stack ubermenu-item-type-column ubermenu-column-id-${++uid}">${c}</li>`;
const stack = (inner) => `<ul class="ubermenu-submenu ubermenu-submenu-id-${++uid} ubermenu-submenu-type-stack">${inner}</ul>`;

function megaItem(n) {
  if (!n.columns) return `<li ${uli(uid + 1)}class="ubermenu-item ubermenu-item-type-custom ubermenu-item-object-custom ubermenu-item-${++uid} ubermenu-item-level-0 ubermenu-column ubermenu-column-auto">${uberLink(n)}</li>`;
  const cols = [uberCol(stack(n.columns.map((c) => uberCol(stack(uberGroup({ label: c.title, links: c.links })), 5, '1-3')).join('')), 3, '2-3')];
  const promo = n.promo ? uberCol(stack(`<li ${uli(uid + 1)}class="ubermenu-item ubermenu-item-type-custom ubermenu-item-object-ubermenu-custom ubermenu-item-${++uid} ubermenu-item-auto ubermenu-item-normal ubermenu-item-level-5 ubermenu-column ubermenu-column-auto"><div class="ubermenu-content-block ubermenu-custom-content ubermenu-custom-content-padded"><div class="menu-promo-item"><div class="card"><div class="card-image image-fit">${img(n.promo.image)}</div><div class="card-body"><h3>${n.promo.title}</h3><p>${n.promo.text}</p></div><div class="card-footer"><a href="${n.promo.cta.href ?? '#'}" target="" aria-label="${n.promo.cta.aria ?? ''}">${n.promo.cta.label}</a></div></div></div></div></li>`), 3, '1-3') : '';
  return `<li ${uli(uid + 1)}class="ubermenu-item ubermenu-item-type-custom ubermenu-item-object-custom ubermenu-item-has-children ubermenu-item-${++uid} ubermenu-item-level-0 ubermenu-column ubermenu-column-auto ubermenu-has-submenu-drop ubermenu-has-submenu-mega">${uberLink(n)}
    <ul class="ubermenu-submenu ubermenu-submenu-id-${++uid} ubermenu-submenu-type-auto ubermenu-submenu-type-mega ubermenu-submenu-drop ubermenu-submenu-align-full_width"><ul class="ubermenu-row ubermenu-row-id-${++uid} ubermenu-autoclear">${cols.join('')}${promo}</ul></ul></li>`;
}

const mobileList = (items) => wpList(items);

export function siteHeader(p = {}) {
  const { logo, utility = [], nav = [], search = {}, login = {}, mobile = {}, searchIcon } = p;
  const searchBox = (sfx) => `<div class="search_box"><form class="inline_site_search" id="cludo-search-form${sfx}" action="${search.action ?? '/'}" method="get" role="search"><label class="inline_site_label${sfx ? ' sr-only' : ''}" for="inline_site_search${sfx.replace('-', '_')}">Search: </label><div><input id="inline_site_search${sfx.replace('-', '_')}" class="search_input" type="search" name="s" placeholder="${search.placeholder ?? 'How can we help you?'}" aria-label="Search through site content" autocomplete="off" aria-autocomplete="list"><button class="search_submit" type="submit" role="button">${img(search.icon ?? searchIcon, { alt: 'Search Site' })}</button></div></form></div>`;
  return `<header id="masthead" class="site-header version-two" role="banner">
  <div class="container"><div class="row align-items-center"><div class="header-grid">
    <div class="header-logo"><div class="site-branding"><a href="${logo.href ?? '#'}" class="custom-logo-link" rel="home">${logo.wordmark ? wordmark(logo.wordmark) : img(logo.src, { width: logo.width, height: logo.height, class: 'custom-logo', alt: logo.alt })}</a></div></div>
    <div class="header-toolbar">
      <div class="desktop-toolbar-wrapper d-none d-md-block"><nav id="desktop-toolbar-navigation" class="desktop-toolbar-navigation"><div class="menu-toolbar-desktop-container"><ul id="menu-toolbar-desktop" class="menu">${wpList(utility)}</ul></div></nav></div>
      <div class="mobile-toolbar-wrapper d-flex align-items-center justify-content-end d-md-none"><ul>
        <li><button id="mobileLogin" type="button" class="btn btn-secondary small btn-login-mobile" aria-controls="login_panel" aria-expanded="false">LOGIN</button></li>
        <li><button type="button" class="mobile-search-toggle" aria-controls="search_panel_mobile" aria-expanded="false">Search</button></li>
        <li><nav class="mobile-menu"><button type="button" id="nav-dash" aria-label="Menu" aria-controls="mobileMenu" aria-expanded="false"><span></span><span></span><span></span><span></span></button></nav></li></ul></div>
    </div>
    <div class="header-megamenu d-none d-md-block"><div class="megamenu"><nav id="site-navigation" tabindex="-1" class="ubermenu ubermenu-nojs ubermenu-main ubermenu-menu-3 ubermenu-loc-menu-1 ubermenu-responsive-collapse ubermenu-horizontal ubermenu-transition-fade ubermenu-trigger-click ubermenu-skin-none  ubermenu-bar-align-full ubermenu-items-align-auto ubermenu-disable-submenu-scroll ubermenu-retractors-responsive ubermenu-submenu-indicator-closes">
      <ul id="site-navigation-nav-list" class="ubermenu-nav" data-title="Megamenu - Main">${nav.map(megaItem).join('')}<li ${uli(uid + 1)}class="btn-search ubermenu-item ubermenu-item-type-custom ubermenu-item-object-custom ubermenu-item-${++uid} ubermenu-item-level-0 ubermenu-column ubermenu-column-auto">${uberLink({ label: 'Search' })}</li></ul></nav></div></div>
  </div></div></div>
  <div class="search-panel" id="search_panel"><div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-8 py-5">${searchBox('')}</div></div></div>
    <div class="popular-searches"><div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-8"><div class="search-title">Most popular searches:</div><div class="menu-popular-searches-container"><ul id="menu-popular-searches" class="popular-searches-results">${wpList(search.popular ?? [])}</ul></div></div></div></div></div></div>
  <div class="search-panel" id="search_panel_mobile"><div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-8 py-5">${searchBox('-mobile')}</div></div></div></div>
  <div class="login-panel" id="login_panel"><div class="login-wrap"><form id="loginForm" autocomplete="off" method="post" action=""><div class="login" id="login">
    <div class="field"><label for="userid" class="">Username</label><input type="text" autocomplete="off" value="" id="userid" name="userid" maxlength="256"></div>
    <div class="field"><label for="password">Password</label><input type="password" value="" id="password" name="password" maxlength="32"></div>
    <div class="field"><input class="btn btn-primary" type="submit" id="submitBtn" value="${login.submit ?? 'Log In'}"></div>
    <div class="field"><a class="btn btn-secondary" href="${login.register?.href ?? '#'}">${login.register?.label ?? 'Register'}</a></div>
    <div class="help"><a href="${login.forgot?.href ?? '#'}">${login.forgot?.label ?? 'Forgot Password?'}</a></div></div></form></div></div>
  <div class="mobile-menu-container"><div class="slinky-menu" id="mobileMenu"><ul id="menu-mobile-menu" class="navigation">${mobileList(mobile.menu ?? [])}</ul></div>
    <div class="mobile-menu-footer"><div class="ctas"><div class="mobile-accordion-menu"><button id="mobileAccountBtn" type="button" class="btn btn-primary">${mobile.accountLabel ?? 'Open an Account'}</button><div class="expander"><ul id="menu-account-menu-mobile" class="navigation">${mobileList(mobile.account ?? [])}</ul></div></div></div>
      <div class="mobile-menu-footer-toolbar"><ul id="menu-toolbar-mobile" class="navigation">${mobileList(mobile.toolbar ?? [])}</ul></div></div></div>
</header>`;
}

/* ---------- Footer ----------
   props: logo{src,alt,href}, social[{label,href,kind}], columns[{title, links[{label,href}]}], member{routing, nmls, cta},
          legal[{label,href}], disclosures[html], copyright, badges[{src,label,href}]  (NCUA / Equal Housing)          */
const menu = (id, items, kindOf) => `<div class="menu-${id}-container"><ul id="menu-${id}" class="menu">${items.map((l) => { const n = ++uid; return `<li id="menu-item-${n}" class="${cx(kindOf?.(l), 'menu-item menu-item-type-custom menu-item-object-custom', `menu-item-${n}`)}"><a href="${l.href ?? '#'}">${l.label}</a></li>`; }).join('')}</ul></div>`;
export function siteFooter(p = {}) {
  const { logo, social = [], columns = [], member = {}, legal = [], disclosures = [], copyright = {}, badges = [] } = p;
  return `<footer id="colophon" class="site-footer" role="contentinfo">
  <div class="footer-main"><div class="container"><div class="row align-items-center align-items-center">
    <div class="col-12 col-sm-6 col-md-3 col-lg-3"><a href="${logo.href ?? '#'}"><div class="footer_logo"><figure class="wp-block-image size-large">${logo.wordmark ? wordmark(logo.wordmark) : img(logo.src, { width: logo.width, height: logo.height, alt: '', class: logo.class })}</figure></div></a></div>
    <div class="col-12 col-md-4 col-lg-4"></div>
    <div class="col-12 col-sm-6 col-md-5 col-lg-5"><div class="footer_social">${menu('footer-social-links', social, (l) => l.kind)}</div></div>
  </div></div></div>
  <div class="footer-links"><div class="container"><div class="row"><div class="footer-col-group g-0">
    ${columns.map((c) => `<div class="footer-col"><div class="footer_links"><h6>${c.title}</h6>${menu('footer-' + (c.slug ?? c.title.toLowerCase().replace(/\W+/g, '-')), c.links)}</div></div>`).join('')}
    <div class="footer-col"><div class="footer_links"><p><strong>${member.routing}</strong><br><strong>${member.nmls}</strong></p><p>${button({ ...member.cta, variant: 'secondary' }).replace(' role="button"', '').replace(/> (.*) </, '>$1<')}</p></div></div>
  </div></div></div></div>
  <div class="footer-secondary"><div class="container"><div class="row">
    <div class="col-12 col-md-7"><div class="footer_info">${menu('copyright-links', legal, (l) => l.kind)}</div>
      <div class="footer_info">${disclosures.map((d) => `<p>${d}</p>`).join('')}</div>
      <span class="copyright">${copyright.year}<span class="footer_copyright"> ${copyright.owner}</span></span></div>
    <div class="col-12 col-md-5 pt-4 pt-lg-0"><div class="footer_logo_block"><div class="footer-badges">${badges.map((b) => `<a href="${b.href ?? '#'}">${img(b.src, { alt: b.alt ?? '' })}${b.label}</a>`).join('')}</div></div></div>
  </div></div></div>
</footer>`;
}

/* ---------- Outbound-link speedbump ---------- */
export const speedbump = ({ owner = 'the credit union' } = {}) => `<div id="speedbump_modal" class="speedbump_container" tabindex="-1" role="dialog" aria-labelledby="speedbump_modal" aria-hidden="true"><div class="speedbump-box">
  <button class="close-speedbump" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  <div class="speedbump-wrapper"><div class="speedbump-content"><div id="managed_speedbump_content"><h2>Just a heads up</h2><p>By continuing, you will be leaving the ${owner} website.</p></div>
  <div class="d-grid d-inline-flex flex-wrap gap-3 mt-4"><a href="" class="btn btn-primary continue" target="_blank">Continue</a><a href="#cancel" class="btn btn-secondary cancel close" target="_blank">Cancel</a></div></div></div></div></div><button id="backToTop" title="Back to Top">&uarr;</button>`;
