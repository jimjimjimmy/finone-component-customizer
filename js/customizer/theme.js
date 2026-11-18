/* Theme model: colour controls, font loading, CSS generation, colour helpers, import/export. */
import { BUTTON_SHAPES, CARD_RADII, PRESETS } from './presets.js';

/* The seven brand colour controls, bound to the exact tokens in tokens.css. `derive` recomputes dependent tokens. */
export const COLOR_CONTROLS = [
  { key: 'primary', label: 'Primary', token: '--color-accent', note: 'links, buttons, rate numerals, focus ring; also Swiper (--color-primary)', derive: { '--color-accent-dark': (c) => shade(c, -0.28) } },
  { key: 'secondary', label: 'Secondary', token: '--color-secondary', note: 'sky band, slider arrows' },
  { key: 'accent', label: 'Accent', token: '--color-tertiary', note: 'tertiary band', derive: { '--color-tertiary-light': (c) => shade(c, 0.3) } },
  { key: 'surface', label: 'Surface', token: '--color-surface', note: 'grey sections, cards' },
  { key: 'highlight', label: 'Highlight', token: '--color-highlight', note: 'yellow band, banners' },
  { key: 'textDark', label: 'Text Dark', token: '--color-dark', note: 'dark sections and body ink' },
  { key: 'textLight', label: 'Text Light', token: '--color-white', note: 'text on dark, white surfaces' },
];

export function shade(hex, amt) {           // amt -1..1: negative darkens, positive lightens
  const n = parseInt(hex.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt));
  return '#' + c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255); };
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
export const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v);

export const fontStack = ([name, kind]) => `"${name}", ${kind}`;
const SELF_HOSTED = ['Source Sans 3', 'Source Serif 4'];
export const googleFontsHref = (fonts) => {
  const names = [...new Set(Object.values(fonts).map((f) => f[0]).filter((n) => !SELF_HOSTED.includes(n)))];
  return names.length ? 'https://fonts.googleapis.com/css2?' + names.map((n) => `family=${n.replace(/ /g, '+')}:wght@400;600;700;900`).join('&') + '&display=swap' : '';
};

/* theme = { tokens, fonts, geometry:{button,card} }  ->  ':root{...}' */
export function themeVars(theme) {
  const v = { ...theme.tokens, '--font-heading': fontStack(theme.fonts.heading), '--font-body': fontStack(theme.fonts.body), '--font-rate': fontStack(theme.fonts.rate),
    '--radius-button': BUTTON_SHAPES[theme.geometry.button], ...CARD_RADII[theme.geometry.card] };
  return v;
}
export const themeCss = (theme) => `:root {\n${Object.entries(themeVars(theme)).map(([k, x]) => `  ${k}: ${x};`).join('\n')}\n}`;

export const clone = (o) => JSON.parse(JSON.stringify(o));
export const presetTheme = (id) => { const p = PRESETS[id]; return clone({ tokens: p.tokens, fonts: p.fonts, geometry: p.geometry }); };

export function exportTheme(state) {
  return { format: 'finone-theme', version: 2, name: PRESETS[state.preset]?.name ?? 'Custom', ...clone(state.theme), org: { ...state.org },
    page: state.stack.map(({ idx, type, props, hidden }) => clone({ idx, type, props, hidden: !!hidden })) };
}
export function importTheme(json) {
  const j = typeof json === 'string' ? JSON.parse(json) : json;
  if (!j.tokens || !j.fonts || !j.geometry) throw new Error('Not a theme.json: needs tokens, fonts and geometry');
  const g = PRESETS.granite;
  return { theme: clone({ tokens: { ...g.tokens, ...j.tokens }, fonts: { ...g.fonts, ...j.fonts }, geometry: { ...g.geometry, ...j.geometry } }), org: j.org ?? null, page: Array.isArray(j.page) ? j.page : null, name: j.name ?? 'Imported' };
}
