# Brief - FinOne block library, Stage 1

Task: rebuild the FinOne Credit Union component library so it matches the engineer's live build (finone.finalytics.ai/blocks) 1:1, while making every block brand-agnostic and themeable. No theme picker, no new layouts.

Scope: tokenize the engineer's CSS (`tokens.css`, default "Granite Credit Union" preset); rebuild every ACF block as a component with props; render a kitchen sink page in the engineer's order.

Acceptance: every block matches the engineer's DOM and renders at the same size and style at 1440 / 768 / 390 px. Calculator has Initial Deposit, APY %, Term Length pills and a live compound-interest result.

---

# Task brief: Mobile Home v01 (Figma 230:48309)

- Version: brief v2026-11-21.1. PM: Jimmy (set scope in chat: "Build this page exactly like the figma file. Make sure you follow the process.").
- Source: Figma file ErpVutS7Rhj1B9ajQq8MTy, node 230:48309 "Mobile Home v01", 402px wide frame (status bar 54px excluded from the page; page height 4878.2px).
- Scope: new customizer template "Mobile Home v01" (`mobile01`) composed of existing FinOne blocks, restyled by rules scoped under `#page.m01` in `variants.css` (viewports below 768px). Layout 02, 03, 08 and the kitchen sink untouched. Inspector editing kept for every string, image and button.
- Copy and imagery: Figma copy (Granite placeholders, "Sed ut perspiciatis", rates 28.05 / 11.05 / 0.05) and Figma image exports, copied locally to `assets/m01/`. Logos stay Finalytics (standing instruction). Placeholder copy is Figma's own; nothing invented.
- Acceptance checks (all measured in the rendered page at 402px unless stated):
  1. Section tops and heights match Figma: header 80, hero 480, rates 235.7, feature 1050.5, image + article 634, articles 678, footer 1720, page 4878.2 (tolerance 1px).
  2. No horizontal overflow at 402, and the layout still holds at 390 and 767.
  3. Typography, spacing and colours per element equal the get_design_context values (see parameter-manifest.md).
  4. Footer element positions match the Figma y-values (within 1px).
  5. `verify.html` still 60/60; Layout 02, Layout 03 and Granite computed styles unchanged from HEAD.
  6. Every visible string, image and button on the new blocks is editable in the inspector.
  7. Independent reviewer compares rendered screenshots with the Figma screenshots and answers E7 and E8.
- Shared task budget: 1 build session, up to 3 review/fix rounds, learning notes included. Cap reached means stop and ask.
- Out of scope: desktop layout for this template (it shows Layout 02 above 768px), Figma writes, publishing.
