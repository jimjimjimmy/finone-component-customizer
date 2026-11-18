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
