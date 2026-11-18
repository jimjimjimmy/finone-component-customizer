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
  return demo;
}
