import { renderBlock, skipLinks, alertBar, siteHeader, siteFooter, speedbump, wireCertificateCalculator } from './blocks.js';
import { header, alert, footer } from './demo/chrome.js';

const demo = await (await fetch('js/demo/granite.json')).json();
const ordered = Object.keys(demo).map(Number).sort((a, b) => a - b);

const main = ordered.map((i) => `<!-- block ${i}: ${demo[i].type} -->${renderBlock(demo[i])}`).join('\n');
document.getElementById('root').innerHTML =
  `${skipLinks()}<div id="page" class="site">${alertBar(alert)}${siteHeader(header)}<main id="primary" class="site-main">${main}</main>${siteFooter(footer)}</div>${speedbump({ owner: 'Granite Credit Union' })}`;

/* Client-rendered harness for verify.html: diffs every block against the engineer's markup (raw/NN.html). */
(await import('./verify.js')).run(ordered, demo);
