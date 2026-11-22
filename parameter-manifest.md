# Parameter manifest: Mobile Home v01 (Figma 230:48309)

Values are read from `get_design_context` per element (design-to-code-qa Phase 1). "Token" is the FinOne variable used; "literal" means the Figma value is hard-coded because no token exists.

| Element (node) | Parameter | Figma value | Built as |
|---|---|---|---|
| Header (230:48756) | size, padding, gap | 402x80, padding 23/18, gap 42 | same, flex row |
| | logo | 145x34 | Finalytics logo (standing instruction), 145x34 |
| | Login button | border 1 `#f94d2b`, r5, pad 6/10/7, 14px bold caps | `--color-accent`, `--radius-button` |
| | search / menu | 28x28 / 32x23, gap 16 | sizes set, existing FinOne glyphs (DIFF) |
| Hero Text (230:48877) | height | 480 | 480 |
| | photo | 212.84% wide, left -83.8%, full height | same |
| | gradient | transparent at 27.529% to `#4b56a8` | `--fade-brand` (= `--color-tertiary`) |
| | text block | pad 12/16, gap 4 | same |
| | eyebrow | Source Sans Black 12, tracking 1.2, white | same |
| | title | Source Serif 48, lh 1.1, white | `--font-heading`; max-width 340 to restore Figma's 3-line wrap |
| | body | Source Sans 16, lh 1.3, tracking .08, `#ffe299` | `--color-highlight` |
| Rates (240:50325) | section | pad 16 top/bottom, `#4b56a8` | `--color-tertiary` |
| | cards | 154.6 wide, border t/b/l .8 `rgba(209,210,211,.5)`, py 6.4, gap 3.2 | same; horizontal scroll, third card peeks |
| | label | 11.2 bold caps white, icon 25.6x22.5 mask `#c1c2c3` | same (`rate-icon-mask.png`) |
| | rate numeral | Serif SemiBold 32, `#ffe299`, first part tracking -1.6 | `--font-rate`; `.trk` span via `rate.track` |
| | % / APY** | Serif Black 16 / Sans SemiBold 11.2, 29px column | same |
| | See all rates | bg `#f94d2b`, pad 8/18, r5, 18.66 bold, 156x39, section 87 | `--color-accent`, height 39 |
| Feature (235:49530) | section | `#4b56a8`, pad 40/16, gap 40, h 1050.5 | same |
| | phones | 141.3x305.5 (border 5.54) and 201.8x436.5 (border 7.914), overlap -23.063, small phone pt 69.189 | same, `phones: 'img'` option on Promo |
| | stats | 240 wide; blue card `#45bfe5` r12 p16; two cards `#dddddc` | `--color-secondary`, `--color-tint` |
| | copy | eyebrow 14 Black 1.4, title Sans 24 lh 1.1, body 16 lh 1.25, white | same |
| | badges | 117.664x40 and 135x40, gap 24 | Figma SVG exports (iOS badge composed from its 4 layers) |
| Image (240:50346) | 402x300, crop 126.74% x 113.28% at -4.24% / -6.66% | same |
| Text - Article (240:50350) | pad 24/24/40, gap 16, eyebrow `#313233`, title `#4b56a8` 24, body `#313233` 16, buttons flex 1, gap 16, pt 24 | `#313233` literal (no token); title `--color-tertiary` |
| Articles (249:50367) | pad 16 / 80, title 20 bold + 16px arrow, card 480 border `#c1c2c3`, 40px gap, panel `rgba(255,255,255,.8)` p24 gap 16, title 26 bold, gradient 21.667% to white, image 191.61% x 126.66% at -26.76% / -26.66% (stretched) | same; scroll-snap row |
| Footer (249:50475) | 375 wide centred, content x 27 to 347, y-values per element | matched (see run-log) |

## Deviations (flagged, not hidden)
- Source Sans 3 / Source Serif 4 (tokens) replace Source Sans Pro / Source Serif Pro. Sans "normal" leading is 1.4 in Source Sans 3 and 1.257 in Pro, so every `leading-normal` is written as 1.257 (eyebrows 1.2286).
- Mock-UI greys kept as literals: `#525252`, `#301f19`, `#e1e2e3`, `#313233` (Figma "Gray Dark", no token), `#c1c2c3` (Figma gray-border).
- Logos are Finalytics, not Granite (standing instruction).
- Social icons: FinOne's five icons at 31px replace Figma's raster strip plus masked X.
- Header search and menu glyphs are FinOne's, not the Figma exports.

## Figma-derived literals (added after review round 1)
Hairlines in the footer: Figma stroke `#4B56A8` at 50% opacity, built as `color-mix(var(--color-tertiary) 50%, transparent)`. Phone ring text `#000` and ring border `rgba(0,0,0,.24)` (Figma "Circle"). Corner radii 21.052 / 30.074 (phones), 56 (ring), 12 (stat cards), 4 (rate-card button). Rate-card padding 1.6/12.8 (button), 6.4/8 (rate block), button height 36.46 (6 + 7 + 23.46 leading). Footer and disclosure copy follows the org-name field (Finalytics.ai by default), as in every other template.

## All remaining px values (review round 2)
Every other px in the Mobile Home v01 CSS is a Figma value or a y-distance derived from the footer frame child positions; see `screenshots/measurements.json` key `px_literals`. Computed colours and fonts vs Figma spec: `computed_vs_figma_spec`. The stat card blue is the `--color-secondary` token (#45bfe5), verified computed rgb(69, 191, 229).
