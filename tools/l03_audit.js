/* Layout 03 audit helper: paste-free. In a page that holds the customizer preview document (see run-log.md), run:
   (await import('/tools/l03_audit.js')).audit()
   Reports horizontal overflow, outermost text insets (px from left/right edge), key section heights and text contrast failures
   (WCAG AA: 4.5:1 normal, 3:1 large) for text over flat colour bands. Text over photos or gradients is skipped. */
export function audit() {
  const W = innerWidth;
  const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] === undefined ? 1 : m[3] }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const blend = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const bgOf = (e) => { const stack = []; for (let n = e; n; n = n.parentElement) { const cs = getComputedStyle(n); const c = parse(cs.backgroundColor); if (c.a > 0) stack.push(c); if (c.a === 1) break; if (cs.backgroundImage !== 'none') return null; }
    let base = { r: 255, g: 255, b: 255, a: 1 }; for (const c of stack.reverse()) base = blend(c, base); return base; };
  const fails = [], ins = [];
  document.querySelectorAll('main h1,main h2,main h3,main p,main li,main a,main .eyebrow,main blockquote,main .div1,main .div2,footer p,footer a,footer h6,footer li').forEach((e) => {
    if (!e.offsetParent) return; const t = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent).join('').trim(); if (!t) return;
    const rg = document.createRange(); rg.selectNodeContents(e); const rr = rg.getBoundingClientRect(); if (rr.width < 2 || rr.left >= W || rr.right <= 0) return;   /* off-screen slider slides do not count */
    ins.push({ l: Math.round(rr.left), r: Math.round(W - rr.right), t: t.slice(0, 26) });
    const cs = getComputedStyle(e), bg = bgOf(e); if (!bg) return;
    const fg = blend(parse(cs.color), bg), a = lum(fg), b = lum(bg), ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const px = parseFloat(cs.fontSize), large = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700), need = large ? 3 : 4.5;
    if (ratio < need) fails.push([t.slice(0, 28), +ratio.toFixed(2), need, cs.color]);
  });
  const by = (k) => ins.reduce((m, x) => (x[k] < m[k] ? x : m), { l: 1e9, r: 1e9 });
  const H = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : null; };
  return { W, overflow: document.documentElement.scrollWidth > W, minLeft: by('l'), minRight: by('r'), hero: H('.hero-fade'), edge: H('.promo-edge .row'), tile: H('.promo-cards-3 .promo-card'), pageH: document.documentElement.scrollHeight, nfails: fails.length, fails: fails.slice(0, 12) };
}
