/* Generates the neutral placeholder artwork for the Ironbridge (Layout 03) template: iron-bridge arches over a blueprint grid.
   Marked PLACEHOLDER on purpose: replace with real member photography before launch. Run: node tools/gen_l03_assets.mjs */
import { writeFileSync } from 'node:fs';
const OUT = 'assets/l03/';
const sets = [
  ['hero', 1600, 1000, ['#0E2A52', '#06122A'], '#F4B942', 5, 0.72, 0.3],
  ['about', 1200, 900, ['#2F6F89', '#0E2A52'], '#F4B942', 3, 0.62, 0.7],
  ['edge', 1400, 1000, ['#16407A', '#0A1B33'], '#F4B942', 4, 0.8, 0.5],
  ['tile-a', 800, 1000, ['#2F6F89', '#0A1B33'], '#F4B942', 2, 0.55, 0.25],
  ['tile-b', 800, 1000, ['#3C86A3', '#0E2A52'], '#E9965A', 3, 0.6, 0.75],
  ['tile-c', 800, 1000, ['#1F5C78', '#071A33'], '#F4B942', 4, 0.58, 0.5],
  ['card-a', 960, 540, ['#2F6F89', '#0E2A52'], '#F4B942', 3, 0.7, 0.2],
  ['card-b', 960, 540, ['#16407A', '#0A1B33'], '#E9965A', 2, 0.7, 0.8],
  ['card-c', 960, 540, ['#3C86A3', '#0A1B33'], '#F4B942', 4, 0.7, 0.5],
  ['cta', 1200, 900, ['#DCE8F0', '#9FC0D3'], '#C2410C', 3, 0.7, 0.6],
];
for (const [name, w, h, [c1, c2], sun, arches, base, sx] of sets) {
  const sunUp = name.startsWith('tile') ? 0.62 : 0.3;   /* tiles: lift the sun clear of the copy that sits on the lower third */
  const gy = Math.round(h * base), gx = Math.round(w * sx);
  const grid = [];
  for (let x = 0; x <= w; x += 80) grid.push(`<path d="M${x} 0V${h}" />`);
  for (let y = 0; y <= h; y += 80) grid.push(`<path d="M0 ${y}H${w}" />`);
  const ar = [];
  for (let i = 0; i < arches; i++) {
    const r = (w * 0.16) + i * (w * 0.085), cx = w * (0.38 + i * 0.07);
    ar.push(`<path d="M${cx - r} ${gy}A${r} ${r * 0.8} 0 0 1 ${cx + r} ${gy}" />`);
    for (let k = -4; k <= 4; k++) ar.push(`<path d="M${cx + (r * k) / 4} ${gy - r * 0.8 * Math.sqrt(1 - (k / 4) ** 2)}V${gy}" opacity=".45" />`);
  }
  const dark = name === 'cta';
  const ink = dark ? '#0A1B33' : '#FFFFFF';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Placeholder image">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g stroke="${ink}" stroke-opacity=".07" stroke-width="1" fill="none">${grid.join('')}</g>
<circle cx="${gx}" cy="${Math.round(gy - h * sunUp)}" r="${Math.round(w * 0.07)}" fill="${sun}" fill-opacity=".92"/>
<g stroke="${ink}" stroke-opacity=".55" stroke-width="${Math.max(3, Math.round(w / 300))}" fill="none">${ar.join('')}</g>
<rect y="${gy}" width="${w}" height="${h - gy}" fill="${dark ? '#0A1B33' : '#06122A'}" fill-opacity=".55"/>
<path d="M0 ${gy}H${w}" stroke="${ink}" stroke-opacity=".7" stroke-width="3"/>
<text x="${w - 28}" y="${h - 24}" text-anchor="end" font-family="Roboto, Arial, sans-serif" font-size="${Math.round(w / 60)}" letter-spacing="3" fill="${ink}" fill-opacity=".7">PLACEHOLDER IMAGE</text>
</svg>`;
  writeFileSync(OUT + name + '.svg', svg);
}
console.log('wrote', sets.length, 'placeholders to', OUT);
