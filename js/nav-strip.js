/* Dev nav strip: one thin bar at the top of every FinOne tool page. Add a page by adding a row to PAGES. */
(function () {
  const PAGES = [
    ['Customizer', 'customizer.html'],
    ['Kitchen sink', 'kitchen-sink.html'],
    ['Verify', 'verify.html'],
  ];
  const H = 28;
  const here = location.pathname.split('/').pop() || 'customizer.html';
  const css = document.createElement('style');
  css.textContent = `
    #fo-nav { position: fixed; top: 0; left: 0; right: 0; height: ${H}px; z-index: 2147483000; display: flex; align-items: center; gap: 4px; padding: 0 12px; box-sizing: border-box; background: #1C2B39; color: #fff; font: 600 12px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
    #fo-nav b { font-weight: 800; letter-spacing: .06em; text-transform: uppercase; opacity: .7; margin-right: 8px; }
    #fo-nav a { color: #fff; text-decoration: none; padding: 6px 10px; border-radius: 4px; opacity: .8; }
    #fo-nav a:hover { opacity: 1; background: rgba(255,255,255,.12); }
    #fo-nav a[aria-current="page"] { opacity: 1; background: #4B56A8; }
    html { padding-top: ${H}px; }
    body.cz { height: calc(100vh - ${H}px); grid-template-rows: calc(100vh - ${H}px); }
    @media print { #fo-nav { display: none; } html { padding-top: 0; } }`;
  document.head.appendChild(css);
  const nav = document.createElement('nav');
  nav.id = 'fo-nav';
  nav.setAttribute('aria-label', 'FinOne tools');
  nav.innerHTML = '<b>FinOne</b>' + PAGES.map(([label, href]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  document.body.insertBefore(nav, document.body.firstChild);
})();
