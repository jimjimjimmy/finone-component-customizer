/* stack.js - page-composition model: block library, templates, per-block override controls. */
import { clone } from './theme.js';

let n = 0;
export const newUid = () => 'b' + (++n) + Math.random().toString(36).slice(2, 5);

/* Human label for one of the 58 demo blocks. */
export function labelOf(entry) {
  const p = entry.props, t = entry.type;
  const tag = { hero: () => `Hero ${p.size}${p.fade ? ' gradient-fade' : ''}${p.rates?.length ? ' + rates' : ''}${p.boxed ? ' boxed' : ''}${p.reverse ? ' reverse' : ''}`, promo: () => `Promo ${p.variant}${p.reverse ? ' reverse' : ''}${p.brandDark ? ' brand-dark' : ''}${p.edge ? ' edge-to-edge' : ''}`,
    banner: () => `Banner ${p.variant}`, steps: () => `Steps ${p.variant}`, quotes: () => `Quotes ${p.variant}`, quicklinks: () => `Quicklinks${p.link ? '' : ' (no link)'}${p.descriptions ? ' + text' : ''}`,
    featureGrid: () => `Feature grid${p.boxed ? ' boxed' : ''}${p.layout === 'vertical' ? ' vertical' : ''}`, introSection: () => `Intro: ${p.eyebrow || p.title || ''}`.slice(0, 40),
    staticCards: () => `Static cards (${p.cards.length})`, rateTable: () => `Rate table: ${p.name.replace('regular_', '')}`, postCards: () => `Posts${p.noBorder ? ' (news)' : ''}`,
    productCards: () => `Product cards${p.noBorder ? ' (no border)' : ''}`, faq: () => 'FAQ accordion', richText: () => 'Rich text', breadcrumbs: () => 'Breadcrumbs', anchorBar: () => 'Anchor bar',
    certificateCalculator: () => 'Certificate calculator', rateCards: () => `Featured rate strip${p.appearance === 'frosted' ? ' frosted' : ''}`, actionCards: () => 'Action cards', promoCards: () => `Promo cards${p.cols === 3 ? ' (3-col)' : ''}`, mixMatch: () => 'Mix-and-match',
    compareTable: () => 'Comparison table', logoGrid: () => 'Logo / awards grid', flexibleColumns: () => 'Flexible columns', disclosures: () => 'Disclosures', tabs: () => 'Tabs' }[t];
  return tag ? tag() : t;
}
export const GROUPS = [['Heroes', ['hero']], ['Rates', ['rateCards', 'rateTable', 'certificateCalculator']], ['Links and features', ['quicklinks', 'featureGrid', 'anchorBar', 'breadcrumbs']],
  ['Promo and banner', ['promo', 'banner', 'tabs']], ['Cards and editorial', ['actionCards', 'promoCards', 'productCards', 'staticCards', 'postCards', 'mixMatch']],
  ['Data, steps, content', ['compareTable', 'steps', 'logoGrid', 'quotes', 'faq', 'richText', 'flexibleColumns', 'introSection', 'disclosures']]];

export const TEMPLATES = {
  home: { name: 'Default homepage', blocks: [0, 11, 14, 33, 19, 23, 45, 54, 57] },
  product: { name: 'Product Detail Page', blocks: [7, 11, 10, 41, 54, 57] },          /* Hero Small Boxed, Rate Strip, Calculator, Comparison Table, FAQ */
  lending: { name: 'Lending / Promo Landing Page', blocks: [1, 15, 33, 42, 22, 57] }, /* Hero Large, Quicklinks (+text), Promo Split, Steps, Action Cards */
  news: { name: 'News & Community Page', blocks: [26, 48, 49, 35, 57] },               /* Intro Medium, Curated Posts, Global News, Promo Offset */
  layout02: { name: 'Layout 02', alert: false, preset: 'layout02', blocks: [100, 102, 103, 105] },  /* Gradient-fade hero, frosted rate strip, brand-dark app promo, edge-to-edge promo, 3 cards (header/footer are site chrome) */
  layout03: { name: 'Layout 03 (Ironbridge)', alert: false, preset: 'ironbridge', blocks: [110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 57] },  /* split hero + stats strip, about, featured edge promo, quick links, photo tiles, events, member types, quote, news, CTA band */
  layout08: { name: 'Layout 08 (Yellow panel hero)', alert: false, preset: 'layout08', blocks: [120, 121, 122, 123] },  /* split panel hero + rate row, app promo on photo, edge feature, article cards (header/footer are site chrome) */
  blank: { name: 'Blank canvas', blocks: [] },
};
export const fromDemo = (demo, idx) => ({ uid: newUid(), idx, type: demo[idx].type, props: clone(demo[idx].props), hidden: false });
export const fromTemplate = (demo, id) => TEMPLATES[id].blocks.map((i) => fromDemo(demo, i));

/* Variant props exposed per block type. */
export const VARIANTS = {
  hero: [['size', 'Size', ['marquee', 'large', 'medium', 'small']], ['boxed', 'Boxed'], ['reverse', 'Reverse'], ['fade', 'Gradient fade (marquee)'], ['tone', 'Text tone', ['light', 'dark']]],
  promo: [['variant', 'Variant', ['product', 'split', 'offset', 'full']], ['reverse', 'Reverse'], ['brandDark', 'Brand-dark background'], ['edge', 'Edge-to-edge media']],
  rateCards: [['appearance', 'Appearance', ['default', 'frosted']]],
  quicklinks: [['descriptions', 'Descriptions'], ['link', 'Linked cards']],
  featureGrid: [['boxed', 'Boxed'], ['border', 'Border'], ['layout', 'Layout', ['grid', 'vertical']]],
  banner: [['variant', 'Variant', ['boxed', 'full']]], steps: [['variant', 'Variant', ['number', 'icon', 'image']]], quotes: [['variant', 'Variant', ['plain', 'boxed']]],
  productCards: [['noBorder', 'No border']], postCards: [['noBorder', 'No border']], introSection: [['boxed', 'Boxed']],
};
export const TONES = ['none', 'surface', 'accent', 'dark', 'secondary', 'tint', 'tertiary', 'highlight', 'white'];
export const SPACES = ['off', 'none', '25', '50', '75', '100'];
const toSpace = (v) => (v === 'off' ? false : v === 'none' ? 'none' : Number(v));
export const fromSpace = (v) => (v === false ? 'off' : String(v ?? 'none'));

export function setSpacing(b, key, v) { b.props.spacing ??= { section: {}, layouts: {} }; b.props.spacing.section ??= {}; b.props.spacing.section[key] = toSpace(v); }
export function setTone(b, tone) {
  if (b.type === 'hero') { b.props.bg = tone; delete b.props.bgColor; }
  else { b.props.spacing ??= { section: {}, layouts: {} }; b.props.spacing.section ??= {}; b.props.spacing.section.bg = tone === 'none' ? 'none' : tone; }
}
export const getTone = (b) => (b.type === 'hero' ? b.props.bg : b.props.spacing?.section?.bg) || 'none';

/* ---- Inline copy & data editing ---- */
const getP = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
export function setP(o, path, v) { const ks = path.split('.'); const last = ks.pop(); const tgt = ks.reduce((a, k) => a[k], o); tgt[last] = v; }
const TEXT_KEYS = [['eyebrow', 'Eyebrow'], ['title', 'Title'], ['text', 'Text'], ['body', 'Body'], ['quote', 'Quote'], ['by', 'Author'], ['excerpt', 'Excerpt'], ['q', 'Question'], ['cta', 'Link label']];
/* Editable text fields for a block: [{path,label,multi,value}] */
export function fieldsOf(b) {
  const p = b.props, out = [];
  const add = (path, label, multi) => { const v = getP(p, path); if (typeof v === 'string' && v !== '') out.push({ path, label, multi: !!multi || v.length > 70, value: v }); };
  const addU = (path, label) => { const v = getP(p, path); if (typeof v === 'string') out.push({ path, label, url: true, value: v }); };
  const addI = (path, label) => { const v = getP(p, path); if (typeof v === 'string' && v) out.push({ path, label, image: true, value: v }); };
  add('eyebrow', 'Eyebrow'); add('title', 'Headline'); add('body', 'Body', true);
  if (p.main) { add('main.eyebrow', 'Eyebrow'); add('main.title', 'Headline'); add('main.body', 'Body', true); add('main.button.label', 'CTA label'); }
  if (p.main) addI('main.image', 'Main image (URL or upload)');
  if ((b.type === 'hero' || b.type === 'promo') && !p.phones) addI('image', 'Photo (URL or upload)');
  (p.buttons || []).forEach((x, i) => { add(`buttons.${i}.label`, `Button ${i + 1} label`); addU(`buttons.${i}.href`, `Button ${i + 1} URL`); });
  (p.badges || []).forEach((x, i) => addU(`badges.${i}.href`, `${x.store === 'google' ? 'Google Play' : 'App Store'} URL`));
  const tk = b.type === 'rateCards' ? 'tiles' : (b.type === 'hero' && p.rates ? 'rates' : null);
  if (tk) (p[tk] || []).forEach((t, i) => {
    add(`${tk}.${i}.title`, `Card ${i + 1} title`);
    if (t.rate) { add(`${tk}.${i}.rate.lead`, `Card ${i + 1} subtitle`); add(`${tk}.${i}.rate.value`, `Card ${i + 1} rate numeral`); add(`${tk}.${i}.rate.unit`, `Card ${i + 1} unit`); add(`${tk}.${i}.rate.label`, `Card ${i + 1} suffix`); } else add(`${tk}.${i}.text`, `Card ${i + 1} text`);
    add(`${tk}.${i}.cta.label`, `Card ${i + 1} button`); addU(`${tk}.${i}.cta.href`, `Card ${i + 1} button URL`);
  });
  if (b.type === 'rateTable') { (p.columns || []).forEach((c, i) => add(`columns.${i}`, `Column ${i + 1}`)); (p.rows || []).forEach((r, i) => r.forEach((c, j) => add(`rows.${i}.${j}`, j === r.length - 1 ? `${r[0]} rate` : `Row ${i + 1} col ${j + 1}`))); add('learn.label', 'Link label'); add('open.label', 'Button label'); }
  if (b.type === 'certificateCalculator') ['deposit', 'apy', 'term'].forEach((k) => { if (p[k] !== undefined) out.push({ path: k, label: { deposit: 'Default deposit', apy: 'Default APY %', term: 'Default term (months)' }[k], value: String(p[k]), num: true }); });
  for (const k of ['items', 'cards', 'steps', 'slides', 'posts', 'panels']) (p[k] || []).forEach((it, i) => {
    for (const [key, lab] of TEXT_KEYS) add(`${k}.${i}.${key}`, `${k.replace(/s$/, '')} ${i + 1} ${lab.toLowerCase()}`);
    ['button', 'link'].forEach((bk) => { add(`${k}.${i}.${bk}.label`, `${k.replace(/s$/, '')} ${i + 1} ${bk}`); if (it[bk]) addU(`${k}.${i}.${bk}.href`, `${k.replace(/s$/, '')} ${i + 1} ${bk} URL`); });
    if (k === 'cards' || k === 'posts') addI(`${k}.${i}.image`, `${k.replace(/s$/, '')} ${i + 1} image (URL or upload)`);
    (it.buttons || []).forEach((_, j) => add(`${k}.${i}.buttons.${j}.label`, `${k.replace(/s$/, '')} ${i + 1} button ${j + 1}`));
  });
  return out.slice(0, 90);
}
