/* overrides.js - cleanup applied to the customizer's copy of the demo content only.
   granite.json stays a verbatim extract of the engineer's page so kitchen-sink.html / verify.html remain a 1:1 baseline. */
const U = 'assets/uploads/';
export function applyOverrides(demo) {
  /* 1. Disclosures: the engineer's CMS field holds JSON-escaped HTML ("u003c/liu003e", "rn"). Rebuild as real HTML. */
  if (demo[57]) demo[57].props.html =
    '<p>APY = Annual Percentage Yield. A penalty may be imposed for early withdrawal, and fees may reduce earnings. Membership ($5) is required. Terms and conditions apply.</p>' +
    '<ol><li>Credit Monitoring and Score are for informational and educational purposes only. There are various types of credit scores, and Granite Credit Union may use a different type of credit score to make lending decisions.</li></ol>' +
    '<p>Paragraph of text beneath the heading to explain the heading. We’ll add onto it with another sentence and probably just keep going until we run out of words.</p>';

  /* 2. Quicklinks: replace the duplicated tiles with distinct credit union items. */
  const OPEN = { icon: U + 'icon-graph.svg', title: 'Open an Account', text: 'Join in minutes and start saving with a membership that works for you.', href: '#' };
  const BRANCH = { icon: U + 'icon-house.svg', title: 'Find a Branch', text: 'Locate a branch or ATM near you and see hours and services.', href: '#' };
  const fix = (i, at, item) => { const it = demo[i]?.props.items; if (it) it[at] = { ...item, ...(it[at]?.text ? {} : { text: undefined }) }; };
  fix(14, 3, OPEN); fix(14, 4, BRANCH);   /* 5-up, no descriptions */
  fix(15, 3, BRANCH);                      /* 4-up with descriptions: last tile repeated "Mortgage Services" */
  for (const i of [14, 15]) demo[i]?.props.items.forEach((x) => { if (!demo[i].props.descriptions) delete x.text; });

  /* 3. Placeholder copy from another institution: use the active org name (swapped in render.js). */
  const rep = (o) => { for (const k in o) { if (typeof o[k] === 'string') o[k] = o[k].replace(/TruStone Financial/g, 'Granite Credit Union').replace(/TruStone/g, 'Granite Credit Union').replace(/https?:\/\/trustonefinancial\.[^"' )]+/g, '#'); else if (o[k] && typeof o[k] === 'object') rep(o[k]); } };
  rep(demo);
  /* 4. Layout 02 building blocks (customizer-only; new variants of existing blocks, not new block types). */
  const L = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.';
  const tile = (icon, title, rate) => ({ icon: U + icon, title, rate, cta: { label: 'Learn more', href: '#' } });
  const r = { lead: 'Rates up to', value: '0.05', unit: '%', label: 'APY' };
  demo[100] = { type: 'hero', props: { size: 'marquee', fade: true, tone: 'light', bg: 'secondary', image: U + 'hero-woman-child-1920x1080-1.webp', eyebrow: 'Eyebrow Category', title: 'Tap into the Value of Your Home',
    body: 'Your possibilities are endless with a 12-month Personal Loan at 8.99% APR*.', buttons: [], rates: Array.from({ length: 5 }, () => tile('icon-piggy-outline.svg', 'Savings Account', r)) } };
  demo[101] = { type: 'rateCards', props: { appearance: 'frosted', pt: 'none', pb: 25, buttons: [], tiles: ['Savings Account', 'Savings Account', 'Savings Account', 'Savings Account', 'Savings Account'].map((t) => tile('icon-certificate.webp', t, r)) } };
  demo[102] = { type: 'promo', props: { variant: 'split', reverse: true, brandDark: true, pt: 50, pb: 75, eyebrow: 'Eyebrow Category', title: 'Sed ut perspiciatis unde omnis iste natus error sit', body: L + ' Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    phones: true, badges: [{ store: 'apple', href: '#' }, { store: 'google', href: '#' }], buttons: [], image: U + 'promo-product-600x600-1.png' } };
  demo[103] = { type: 'promo', props: { variant: 'split', reverse: true, edge: true, pt: 'none', pb: 'none', eyebrow: 'Eyebrow Category', title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    body: L + ' Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.', buttons: [{ label: 'Apply Now', href: '#', variant: 'primary' }, { label: 'Learn More', href: '#', variant: 'secondary' }], image: U + 'hero-boxes-large-01.webp' } };
  demo[104] = { type: 'staticCards', props: { pt: 75, pb: 75, bg: 'none', eyebrow: '', title: '', body: '', cards: ['card-couple-on-counch', 'card-family-hiking', 'card-mom-kids'].map((n) => ({ type: 'image', title: 'Sed ut perspiciatis unde omnis', body: L, image: U + n + '-480x240-1.webp', button: { label: 'Learn More', href: '#', variant: 'secondary' } })) } };
  demo[105] = { type: 'promoCards', props: { pt: 75, pb: 75, bg: 'none', cols: 3, title: '', body: '', cards: [['card-couple-on-counch', 'Home'], ['card-family-hiking', 'Family'], ['card-mom-kids', 'Youth']].map(([n, e]) => ({ eyebrow: 'Eyebrow Category', title: 'Sed ut perspiciatis unde omnis', body: '<p>' + L + ' Nemo enim ipsam voluptatem quia voluptas sit aspernatur.</p>', button: { label: 'Learn More', href: '#', variant: 'text' }, image: U + n + '-480x240-1.webp' })) } };
  return demo;
}
