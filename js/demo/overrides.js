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
  demo[100] = { type: 'hero', props: { size: 'marquee', fade: true, tone: 'light', bg: 'secondary', image: U + 'hero-woman-child-1920x1080-1.webp', eyebrow: 'Eyebrow Category', title: 'Tap into the Value of<br class="br-desktop"> Your Home',
    body: 'Your possibilities are endless with a 12-month Personal Loan at 8.99% APR*.', buttons: [], rates: Array.from({ length: 5 }, () => tile('icon-piggy-outline.svg', 'Savings Account', r)) } };
  demo[101] = { type: 'rateCards', props: { appearance: 'frosted', pt: 'none', pb: 25, buttons: [], tiles: ['Savings Account', 'Savings Account', 'Savings Account', 'Savings Account', 'Savings Account'].map((t) => tile('icon-certificate.webp', t, r)) } };
  demo[102] = { type: 'promo', props: { variant: 'split', reverse: true, brandDark: true, pt: 50, pb: 75, eyebrow: 'Eyebrow Category', title: 'Sed ut perspiciatis unde omnis enim ad minima veniam, quis elam', body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia enim ipsam voluptatem quia voluptas.',
    phones: true, badges: [{ store: 'apple', href: '#' }, { store: 'google', href: '#' }], buttons: [], image: U + 'promo-product-600x600-1.png' } };
  demo[103] = { type: 'promo', props: { variant: 'split', reverse: true, edge: true, pt: 'none', pb: 'none', eyebrow: 'Eyebrow Category', title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
    body: L + ' Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.', buttons: [{ label: 'Apply Now', href: '#', variant: 'primary' }, { label: 'Learn More', href: '#', variant: 'secondary' }], image: U + 'hero-boxes-large-01.webp' } };
  demo[104] = { type: 'staticCards', props: { pt: 75, pb: 75, bg: 'none', eyebrow: '', title: '', body: '', cards: ['card-couple-on-counch', 'card-family-hiking', 'card-mom-kids'].map((n) => ({ type: 'image', title: 'Sed ut perspiciatis unde omnis', body: L, image: U + n + '-480x240-1.webp', button: { label: 'Learn More', href: '#', variant: 'secondary' } })) } };
  demo[105] = { type: 'promoCards', props: { pt: 75, pb: 75, bg: 'none', cols: 3, title: '', body: '', cards: [['card-couple-on-counch', 'Home'], ['card-family-hiking', 'Family'], ['card-mom-kids', 'Youth']].map(([n, e]) => ({ eyebrow: 'Eyebrow Category', title: 'Sed ut perspiciatis unde omnis', body: '<p>' + L + ' Nemo enim ipsam voluptatem quia voluptas sit aspernatur.</p>', button: { label: 'Learn More', href: '#', variant: 'text' }, image: U + n + '-480x240-1.webp' })) } };

  /* 5. Layout 03 "Ironbridge" building blocks (customizer-only; composed from existing blocks, restyled by variants.css under .l03).
     ORG is the engineer's default org string: render.js swaps it for the active org name, so copy follows the Org name field.
     Figures, dates and quotes are marked placeholders (never real claims). */
  const ORG = 'Granite Credit Union', A = 'assets/l03/', LP = 'Placeholder: replace with a real, approved member quote before launch.';
  const stat = (title, value, unit) => ({ icon: U + 'icon-checkmark.svg', title, rate: { lead: '', value, unit, label: '' }, cta: { label: 'Learn more', href: '#' } });
  demo[110] = { type: 'hero', props: { size: 'marquee', fade: true, tone: 'light', bg: 'tertiary', image: A + 'hero.svg', eyebrow: 'Member-owned. Locally decided.',
    title: 'Banking built to carry the load', body: ORG + ' is the credit union for people who keep things running: trades, plant, fleet and field crews. Fair rates, local decisions, no upselling.',
    buttons: [{ label: 'Join now', href: '#', variant: 'primary' }, { label: 'Explore accounts', href: '#', variant: 'secondary-white' }],
    rates: [stat('Members (placeholder)', '00k', '+'), stat('Branches and shared centres', '00', '+'), stat('Years serving members', '00', '+'), stat('Loans funded each year', '$0', 'M')] } };
  demo[111] = { type: 'featureGrid', props: { bg: 'none', pt: 100, pb: 75, border: true, layout: 'grid',
    main: { eyebrow: 'About ' + ORG, title: 'Everyday banking for the people who keep things running', body: 'Joining takes minutes. Once you are in, you own a share of the credit union and get a say in how it is run.', image: A + 'about.svg', button: { label: 'Learn about us', href: '#', variant: 'primary' } },
    items: [['icon-checking.webp', 'Open an account', 'Checking and savings with no monthly fee tricks.'], ['icon-car.webp', 'Borrow for work and home', 'Vehicle, equipment and home loans with local decisions.'], ['icon-calculators.svg', 'Plan and save', 'Calculators and one-to-one money check-ups.'], ['icon-house.svg', 'Find a branch', 'Hours, ATMs and shared-branch locations near you.']]
      .map(([ic, t, x]) => ({ icon: U + ic, title: t, text: x, link: { label: 'Learn more', href: '#', aria: t } })) } };
  demo[112] = { type: 'promo', props: { variant: 'split', reverse: false, edge: true, sectionBg: 'tertiary', pt: 'none', pb: 'none', eyebrow: 'Featured', title: 'What’s new at ' + ORG,
    body: 'Lower-rate auto loans, extended Saturday hours and free budgeting workshops are all on the way this season.', buttons: [{ label: 'See what’s new', href: '#', variant: 'primary' }, { label: 'Join a workshop', href: '#', variant: 'secondary-white' }], image: A + 'edge.svg' } };
  demo[113] = { type: 'quicklinks', props: { bg: 'surface', pt: 100, pb: 100, eyebrow: 'Quick links', title: 'Know where you’d like to go?', link: true, descriptions: true,
    items: [['icon-graph.svg', 'Open an account', 'Join in minutes.'], ['icon-calculators.svg', 'Apply for a loan', 'Vehicle, equipment, home.'], ['icon-house.svg', 'Find a branch or ATM', 'Hours and locations.'], ['icon-piggy-outline.svg', 'Rates and calculators', 'See what fits your budget.']].map(([ic, t, x]) => ({ icon: U + ic, title: t, text: x, href: '#' })) } };
  demo[114] = { type: 'promoCards', props: { pt: 100, pb: 100, bg: 'none', cols: 3, title: 'Find your path', body: '',
    spacing: { section: { bg: 'secondary' }, layouts: {} },
    cards: [['tile-a', 'Trades and plant', 'Tradespeople and crews'], ['tile-b', 'Fleet and transport', 'Drivers and depots'], ['tile-c', 'Field and site', 'Engineers and surveyors']].map(([n, e, t]) => ({ eyebrow: e, title: t, body: '<p>Accounts, loans and advice shaped around shift work and seasonal pay.</p>', button: { label: 'Explore', href: '#', variant: 'text' }, image: A + n + '.svg' })) } };
  demo[115] = { type: 'actionCards', props: { pt: 100, pb: 100, bg: 'none', eyebrow: 'Events', title: 'Money workshops and member nights', body: 'Sample events: replace with your real calendar.',
    cards: [['Thu 26 Nov · Online', 'Budgeting for variable income'], ['Sat 05 Dec · Main branch', 'First-time home buyer clinic'], ['Wed 10 Dec · Online', 'Protect yourself from scams']].map(([e, t]) => ({ eyebrow: e, title: t, body: 'Free for members. Places are limited, so reserve a seat early.', buttons: [{ label: 'Register', href: '#', variant: 'secondary' }] })) } };
  demo[116] = { type: 'productCards', props: { bg: 'tertiary', pt: 100, pb: 100, noBorder: true, eyebrow: 'Membership', title: 'Pick the membership that fits',
    cards: [['icon-graph.svg', 'Standard membership', 'Open to anyone who lives, works or worships in the region.'], ['icon-calculators.svg', 'Trades and plant', 'For people who work in engineering, transport and field services.'], ['icon-piggy-outline.svg', 'Youth saver', 'A first account for under 18s, with a parent or guardian.'], ['icon-house.svg', 'Business membership', 'Accounts and lending for small firms and sole traders.']]
      .map(([ic, t, x]) => ({ icon: U + ic, title: t, body: x, link: { label: 'Learn more', href: '#', aria: t } })) } };
  demo[117] = { type: 'quotes', props: { variant: 'boxed', boxedBg: 'dark', title: 'Hear from our members', spacing: { section: { bg: 'surface' }, layouts: {} },
    slides: [{ quote: LP, by: 'Member name, role (placeholder)' }, { quote: LP, by: 'Member name, role (placeholder)' }, { quote: LP, by: 'Member name, role (placeholder)' }] } };
  demo[118] = { type: 'postCards', props: { pt: 100, pb: 100, bg: 'none', eyebrow: 'Stay informed', title: 'Latest from ' + ORG, noBorder: false,
    posts: [['card-a', 'News', 'Auto loan rates updated for the new season'], ['card-b', 'Community', 'Our crews give back: volunteer day round-up'], ['card-c', 'Guides', 'Five checks before you sign a vehicle loan']].map(([n, e, t]) => ({ image: A + n + '.svg', eyebrow: e, title: t, href: '#', excerpt: 'Sample article summary. Replace with real copy from your news feed.', cta: 'Read more' })),
    buttons: [{ label: 'View all news', href: '#', variant: 'secondary' }] } };
  demo[119] = { type: 'promo', props: { variant: 'split', reverse: true, sectionBg: 'secondary', pt: 75, pb: 75, eyebrow: 'Branch appointments', title: 'Book a free money check-up',
    body: 'Sit down with a member advisor in person or online. We will look at your budget, your goals and the products that genuinely fit.', buttons: [{ label: 'Book an appointment', href: '#', variant: 'primary-white' }], image: A + 'cta.svg' } };

  /* 6. Layout 08 (Figma "Layout 08 v2", node 195:42261): composed from existing blocks; yellow panel hero, indigo app promo on a photo, edge feature, article cards.
     Photos are local placeholders (the Figma stock comps are watermarked and are not copied into the repo). */
  const rt = { lead: 'Rates up to', value: '0.05', unit: '%', label: 'APY*' };
  demo[120] = { type: 'hero', props: { size: 'marquee', fade: true, panel: true, tone: 'light', bg: 'none', image: U + 'hero-large-1920x860-1.webp', eyebrow: 'Eyebrow category', title: 'Tap into the Value of Your Home',
    body: 'Your possibilities are endless with a 12-month Personal Loan at 8.99% APR*.', buttons: [], rates: Array.from({ length: 3 }, () => tile('icon-piggy-outline.svg', 'Savings Account', rt)) } };
  demo[121] = { type: 'promo', props: { variant: 'split', reverse: false, brandDark: true, pt: 50, pb: 75, bgImage: U + 'hero-woman-child-1920x1080-1.webp', eyebrow: 'Eyebrow category', title: 'Sed ut perspiciatis unde omnis enim ad minima veniam, quis elam',
    body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia enim ipsam voluptatem quia voluptas.',
    phones: true, badges: [{ store: 'apple', href: '#' }, { store: 'google', href: '#' }], buttons: [], image: U + 'promo-product-600x600-1.png' } };
  demo[122] = { type: 'promo', props: { variant: 'split', reverse: true, edge: true, pt: 'none', pb: 'none', eyebrow: 'Eyebrow category', title: 'Sed ut perspiciatis unde omnis enim ad minima veniam, quis elam',
    body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia enim ipsam voluptatem quia voluptas.',
    buttons: [{ label: 'Apply Now', href: '#', variant: 'primary' }, { label: 'Learn More', href: '#', variant: 'secondary' }], image: U + 'l08-edge-feature.jpg' } };
  demo[123] = { type: 'promoCards', props: { pt: 75, pb: 75, bg: 'none', cols: 3, title: 'What’s Happening at Granite Credit Union', body: '', headerLink: { label: 'All Articles', href: '#' }, spacing: { section: { bg: 'secondary' }, layouts: {} },
    cards: ['l08-article-1.jpg', 'l08-article-2.jpg', 'l08-article-3.png'].map((f) => ({ eyebrow: 'Eyebrow category', title: 'Sed ut perspiciatis unde omnis', body: '<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.</p>', button: { label: 'Learn More', href: '#', variant: 'text' }, image: U + f })) } };
  return demo;
}
