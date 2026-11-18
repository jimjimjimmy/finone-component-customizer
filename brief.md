# Brief - FinOne block library, Stage 1

Task: rebuild the FinOne Credit Union component library so it matches the engineer's live build (finone.finalytics.ai/blocks) 1:1, while making every block brand-agnostic and themeable. No theme picker, no new layouts.

Scope: tokenize the engineer's CSS (`tokens.css`, default "Granite Credit Union" preset); rebuild every ACF block as a component with props; render a kitchen sink page in the engineer's order.

Acceptance: every block matches the engineer's DOM and renders at the same size and style at 1440 / 768 / 390 px. Calculator has Initial Deposit, APY %, Term Length pills and a live compound-interest result.
