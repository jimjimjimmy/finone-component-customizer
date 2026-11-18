/* blocks.js - registry. renderBlock({type, props}) -> HTML.  Pages are just ordered arrays of {type, props}. */
import { withSpacing } from './lib.js';
import { hero } from './components/heroes.js';
import { rateCards, rateTable } from './components/rates.js';
import { certificateCalculator, wireCertificateCalculator } from './components/calculator.js';
import { quicklinks } from './components/quicklinks.js';
import { featureGrid } from './components/features.js';
import { promo, banner, tabs } from './components/promos.js';
import { actionCards, promoCards, productCards, staticCards, postCards, mixMatch } from './components/cards.js';
import { compareTable, steps, logoGrid, quotes, faq } from './components/data.js';
import { richText, flexibleColumns, anchorBar, breadcrumbs, disclosures, introSection } from './components/content.js';
import { skipLinks, alertBar, siteHeader, siteFooter, speedbump } from './components/chrome.js';

export const blocks = { hero, rateCards, rateTable, certificateCalculator, quicklinks, featureGrid, promo, banner, tabs, actionCards, promoCards,
  productCards, staticCards, postCards, mixMatch, compareTable, steps, logoGrid, quotes, faq, richText, flexibleColumns, anchorBar, breadcrumbs,
  disclosures, introSection };
export { wireCertificateCalculator, skipLinks, alertBar, siteHeader, siteFooter, speedbump };

export function renderBlock(b) {
  const fn = blocks[b.type];
  if (!fn) throw new Error('Unknown block type: ' + b.type);
  const props = { ...b.props };
  if (b.type === 'tabs') props.panels = props.panels.map((pn) => ({ label: pn.label, target: pn.target, html: renderBlock(pn.block) }));
  const { spacing, ...rest } = props;
  return withSpacing(spacing, () => fn(rest));
}
export const renderPage = (list) => list.map(renderBlock).join('\n');
