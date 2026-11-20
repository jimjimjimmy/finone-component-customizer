# Run log

## 2026-11-18 - Stage 1 build (Claude, main session)
- No attachments came through; pulled the engineer's public HTML, CSS and JS from the live site into `source/`.
- Audit: the engineer's custom layer is already ~95% variable-driven (`--sunset`, `--denim` ...). Renamed to brand-agnostic tokens; only literal hex values left in `blocks.css` is Swiper's default #007aff.
- Components written per ACF block; demo props extracted from the engineer's markup (`tools/extract_demo.py`) so copy is theirs.
- Verification: DOM diff 60/60; heights identical at 1440/768/390; computed-style hash identical on every section except the calculator.
- Found and fixed: theme JS needs static markup (events), Swiper URL resolves against the theme script, rate-table AJAX hydration disabled (opt-in), stray `</p>` artefact reproduced.
- NOT RUN: hover/focus/open-menu states, screenshot pixel diff, accessibility checks.
- Open: calculator has no engineer reference (see README deviation 1).
- Cleanup: exploration scripts and unused downloaded engineer scripts moved to `_scratch/` (deletion was declined); safe to remove.
- 2026-11-18: relocated to Finalytics/FinOne; Stage 2 customizer added.

## 2026-11-19 - Layout 03 "Ironbridge" (reference: soe.org.uk, layout and colour only)

Client: Ironbridge Members Credit Union (fictional; routing 253177049, NMLS 1048213 are made up). Skills read: designer-base, designer-reference, delight-impeccable, delight-interfaces. Mode per section: Persuade (hero, promos), Operate-leaning for quick links and rates.

### Reference notes (desktop 1440, captured from the live page)
- Section order: hero, stats strip, about + 4 links, featured content (navy), quick links, sectors (photo tiles), events, membership grades (navy carousel), testimonials (#F8F9FA), news, office-space CTA (steel band), footer (navy).
- Colours (sampled): navy #06122A (hero, dark bands, ~45% of area), steel #407997 (stats strip, sectors tile, CTA band), near-white #F8F9FA, pale blue cards #DCEDF3 / #BEDDEE, deep blue #002057, orange #E4572E (tiny accent).
- Type: Roboto, headings 700 at 48px, hero 55px, body 18px #363636. Corners: 5px buttons, 0 on bands, ~8px on photo tiles.
- Devices: stats strip overlapping the hero's bottom edge; photo tiles with title overlaid; hero split (navy copy left, photo right).
- 390px reference NOT captured: a reload hit the site's "I am human" bot check, which I do not bypass.

### Section mapping
| Reference | FinOne block | Notes |
|---|---|---|
| Hero, navy + photo right, 2 CTAs | `hero` marquee `fade` (+ `.l03` CSS: photo right 55%, chamfered edge, navy fills left) | solid + outline CTA |
| Stats strip (members, partners, years, awards) | `hero.rates` (4 tiles, rate field used as the figure) | figures are placeholders; tile button hidden by CSS but still editable |
| About + 4 feature links | `featureGrid` (main image + 4 items, border) | |
| Featured content, navy band + photo | `promo` split `edge` + `brandDark` | image fades into navy (CSS) |
| Quick links | `quicklinks` with descriptions | |
| Sectors, photo tiles with overlaid title | `promoCards` 3-col, `.l03` makes each card a photo tile | no native tile block |
| Events | `actionCards` | text cards, "Register" button |
| Membership grades carousel (navy) | `productCards` bg tertiary, light cards | NO carousel match: shown as a grid |
| Testimonials | `quotes` boxed | placeholder text only (never invent testimonials) |
| News list | `postCards` noBorder | |
| Office-space CTA band | `promo` split bg secondary | |
| Footer / header | site chrome | |

### Signature details (original, not in the reference)
1. Chamfered corner (clip-path cut) on the hero photo and the stats strip, plus a 6px highlight-amber rule on top of the strip.
2. "Gauge tick" rule: a ruler-style tick pattern under each stat numeral and above section eyebrows.
3. Placeholder art is an iron-bridge arch motif (brand story: Ironbridge) instead of stock photography.

### Built
- Preset `ironbridge` (presets.js), template `layout03` (stack.js, loads the preset), demo blocks 110-119 (overrides.js, composed from existing block types), `#page.l03` class (render.js), scoped CSS (variants.css, bottom of file, every selector under `.l03`, no hex), 10 generated placeholder SVGs (`assets/l03/`, `tools/gen_l03_assets.mjs`), audit helper (`tools/l03_audit.js`).
- Inspector: added Main image (feature grid), post image and post link label fields. Every visible string, image and button on blocks 110-119 is editable (checked by diffing each block's strings against `fieldsOf()`; the stat tile buttons are hidden by CSS but still editable).
- Not forked: no block component changed.

### DIFF list (side by side with soe.org.uk, desktop; 390 reference not capturable)
- DIFF intentional: hero photo has a diagonal-cut edge and the stats strip a cut corner plus amber top rule; reference is square.
- DIFF intentional: Roboto Slab 700 headings (reference Roboto 700); band navy #0E2A52 (ref #06122A), ink #0A1B33, steel #2F6F89 (ref #407997, lifted for 5.6:1 white text), primary buttons copper #C2410C (ref navy buttons).
- DIFF intentional: placeholder SVG art (bridge arches) replaces photography; stat figures are placeholders (00k+, $0M).
- DIFF framework: header and footer are FinOne chrome (mega menu, NCUA badges); reference has a phone/email utility bar and sector links.
- DIFF no block match: membership-grade carousel is a 4-up grid; "What's new" accordion list is a plain edge promo; sectors tile with title is a section heading above three photo tiles; testimonials are one boxed slider, not a card row; hero avatar "join 8,000+" chip not reproduced.
- DIFF height: hero 659px vs reference 585px (strip plus 2 CTAs need the room).

### Verification (customizer preview document, standalone, measured with tools/l03_audit.js)
| Check | Result |
|---|---|
| Horizontal overflow at 390, 720, 767, 900, 1440, 1920 | none |
| 16px side margins at 390, 720, 767 | min text inset 16px at every width (hero, strip, tiles, edge promo, footer) |
| Section heights 1440 vs 1920 | hero 659 / 659, edge promo 521 / 521, tiles 460 / 460 |
| Text contrast on flat bands (AA, 4.5 normal / 3 large) | 0 failures at 390, 720, 767, 900, 1440, 1920 (one earlier fix: footer links) |
| Token edit (Primary, Accent, Secondary, Dark, heading and body font, button shape, card radius) | buttons, bands, strip, footer, fonts, pill buttons, tile radius all followed (tile radius needed a fix: Layout 02 hard-codes 0) |
| `verify.html` | VERIFY 60/60 |
| Granite (home) and Layout 02 unchanged | computed-style hash of every element in main, header and footer identical with the committed variants.css and the new one (790 and 775 nodes) |
| 680-767px and footer on mobile | checked at 720 and 767 and 390; footer gutters fixed (were 26-36px) |

### Skill gaps (feedback on typographic-agency-os)
- delight-impeccable: launcher `scripts/impeccable` does not exist (as noted in the brief); `SKILL.md` tells the reader to run it first.
- craft-floor.md bans an eyebrow over any heading ("no brief earns it back"), the hero-metric template (big number, small label) and identical icon+heading+text card grids. This brief (and the reference) requires all three, and FinOne blocks render eyebrows by default. Framework won; flagging for a decision on whether the floor needs a "brief or reference may require" clause.
- craft-floor.md says "the brief wins" in SKILL.md but "no brief earns it back" for eyebrows: the two lines contradict.
- craft-floor.md Refuse list allows stripe and grid backgrounds only with a measuring-tool or blueprint subject; the "gauge tick" and blueprint grid rely on that clause. Worth stating how a reviewer judges "actual canvas".
- delight-impeccable needs PRODUCT.md and DESIGN.md; neither exists for FinOne, so direction was recorded in this log instead.
- designer-base.md assumes Figma and a PM-named reviewer; this task had neither. No work is marked approved.
- delight-transitions and delight-gsap not used: the only motion is a 0.45s tile hover guarded by `prefers-reduced-motion`.

### Not verified
- Reference at 390 (bot check) and at 1920 side by side; Safari and Firefox (uses clip-path, color-mix, :is, container units); hover and keyboard focus states beyond the tile; screen reader pass; mobile menu open state; rate-strip behaviour of the other templates after this change (hash only covers Granite home and Layout 02).
