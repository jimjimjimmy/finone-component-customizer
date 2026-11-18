/* Renders every block (in the engineer's /blocks order) to a static kitchen-sink.html.
   Static markup means the engineer's theme JS (fade-in, Swiper, slinky menu, anchor bar) initialises exactly as on the live site. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderBlock, skipLinks, alertBar, siteHeader, siteFooter, speedbump } from '../js/blocks.js';
import { header, alert, footer } from '../js/demo/chrome.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demo = JSON.parse(readFileSync(join(root, 'js/demo/granite.json'), 'utf8'));
const order = Object.keys(demo).map(Number).sort((a, b) => a - b);
const main = order.map((i) => `<!-- block ${i}: ${demo[i].type} -->\n${renderBlock(demo[i])}`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FinOne Blocks Kitchen Sink</title>
<link rel="stylesheet" href="vendor/bootstrap.css">
<link rel="stylesheet" href="vendor/fa-all.min.css">
<link rel="stylesheet" href="vendor/ubermenu.min.css">
<link rel="stylesheet" href="vendor/tablepress.css">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="blocks.css">
<link rel="stylesheet" href="calculator.css">
</head>
<body class="blocks-kitchen-sink">
<div class="site-overlay-dark"></div>
${skipLinks()}
<div id="page" class="site">
${alertBar(alert)}
${siteHeader(header)}
<main id="primary" class="site-main">
${main}
</main>
${siteFooter(footer)}
</div>
${speedbump({ owner: 'Granite Credit Union' })}
<script>window.wp_ajax = { ajaxurl: '#', swiperUrl: './swiper.min.js' };</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="vendor/main.min.js"></script>
<script type="module">import { wireCertificateCalculator } from './js/components/calculator.js'; wireCertificateCalculator();</script>
</body>
</html>
`;
writeFileSync(join(root, 'kitchen-sink.html'), html);
console.log(`kitchen-sink.html: ${order.length} blocks, ${(html.length / 1024).toFixed(0)} KB`);
