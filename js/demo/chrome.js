/* Granite Credit Union - header / footer demo content (the engineer's placeholder copy). Swap for any brand. */
const U = 'assets/uploads/';
const L = (label, href = '#') => ({ label, href });
const P = (label, href) => ({ ...L(label, href), wpType: 'post_type', wpObject: 'product' });  /* CMS product-page link */
export const header = {
  logo: { src: U + 'finalytics-lockup-horizontal-tagline-black.svg', alt: 'Granite Credit Union', href: '/', width: 432, height: 105 },
  searchIcon: U + 'icon-search.svg',
  utility: [
    { ...L('Rates'), children: ['Checking and Savings', 'Retirement', 'Certificates', 'Home Loans', 'Personal Loans'].map((x) => L(x)) },
    L('Contact Us'), L('Careers'), { ...L('Locations', 'https://finone.finalytics.ai/locations'), wpType: 'post_type', wpObject: 'page' },
    { ...L('Login'), kind: 'login' },
    { ...L('Open an Account'), kind: 'account', children: ['Checking', 'Savings', 'Credit Card', 'Money Market', 'Certificate Deposit', 'Mortgage'].map((x) => L(x)) },
  ],
  nav: [
    { label: 'Accounts', columns: [
        { title: 'Checking', links: [...['Advanced Checking', 'Basic Checking', 'SMART Checking', 'Visa® Debit Card', 'Purchase Rewards'].map((x) => L(x)), P('Credit Cards', 'https://finone.finalytics.ai/credit-card')] },
        { title: 'Savings', links: [...['Regular Savings', 'Secondary Savings', 'SMART Savings', 'Money Market'].map((x) => L(x)), P('Certificates', 'https://finone.finalytics.ai/product/savings-certificates'), L('IRA Accounts')] },
        { title: 'Support', links: ['Online Banking', 'Mobile Banking', 'Digital Wallet', 'Overdraft Protection', 'Reorder Checks', 'Direct Deposit', 'Report Lost or Stolen Card', 'Fraud Prevention'].map((x) => L(x)) } ],
      promo: { image: U + 'card-woman-and-child-planting-480x240-1.webp', title: 'Savings Certificates', text: 'Ex eros dignissim quis nisi, dolor elit exercitation ea ex tempuribud laboris ullamco, amet eu urna.', cta: { label: 'Details', href: 'https://finone.finalytics.ai/product/savings-certificates', aria: 'Learn more about checking accounts' } } },
    { label: 'Loans', columns: [
        { title: 'Vehicle Loans', links: [P('Auto Loans', 'https://finone.finalytics.ai/product/auto-loans'), ...['Refinance a Car', 'Adventure Loans', 'GAP Protection', 'Mechanical Breakdown Protection'].map((x) => L(x))] },
        { title: 'Personal Loans', links: ['Debt Consolidation Loan', 'QCash', 'SecureLoans'].map((x) => L(x)) },
        { title: 'Resouces', links: ['Loan Protection', 'Make a Payment', 'AutoSMART Car Buying Service'].map((x) => L(x)) } ],
      promo: { image: U + 'card-auto-loan-480x240-1.webp', title: 'Get an Auto Loan Today', text: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit sid nonummy.', cta: { label: 'See Auto Loans', href: 'https://finone.finalytics.ai/product/auto-loans' } } },
    ...['Credit Cards', 'Home Loans', 'Insurance', 'Business', 'Learn'].map((x) => L(x)),
  ],
  search: { popular: ['Routing #322484265', 'Report a lost or stolen card', 'Auto Loan Rates', 'Help logging in?', 'Who can join?', 'CD Rates'].map((x) => L(x)) },
  login: { submit: 'Log In', register: L('Register'), forgot: L('Forgot Password?') },
  mobile: {
    menu: [{ ...L('Checking'), children: ['Checking Accounts', 'Digital Banking', 'Resources'].map((x) => L(x)) }, { ...L('Savings'), children: ['Savings Accounts', 'Banking Services', 'Resources'].map((x) => L(x)) }, L('Credit Cards')],
    account: ['Checking', 'Savings', 'Credit Cards', 'Money Market', 'Certificate Deposit', 'Mortgage'].map((x) => L(x)),
    toolbar: ['Rates', 'Contact', 'Support', 'Locations'].map((x) => L(x)),
  },
};
export const alert = { tone: 'secondary', title: 'Secondary Alert Title', text: 'Nulla dolore dignissim ullamco dignissim, nulla sed laboris in ea adipiscing dolor harmud elit nunc urna sint urna pulvinar velit sit exercitation.', id: 'site-alert-demo' };
export const footer = {
  logo: { src: U + 'logo-granitecu-black.svg', alt: 'Granite Credit Union', href: '/', class: 'wp-image-1384', width: 235, height: 60 },
  social: [['YouTube', 'youtube'], ['Facebook', 'facebook'], ['LinkedIn', 'linkedin'], ['Instagram', 'instagram'], ['X', 'x']].map(([label, kind]) => ({ ...L(label), kind })),
  columns: [
    { title: 'Save', slug: 'personal', links: ['Checking Accounts', 'Savings Accounts', 'Credit Cards', 'Mortgages', 'Investments & Insurance'].map((x) => L(x)) },
    { title: 'Spend', slug: 'business', links: ['Business Accounts', 'Business Loans'].map((x) => L(x)) },
    { title: 'Borrow', slug: 'financial-wellness', links: ['Explore by Topic', 'Homeownership', 'College Planning', 'Retirement', 'Manage Debt'].map((x) => L(x)) },
    { title: 'Explore', slug: 'about-us', links: ['Our History', 'Why Choose Us', 'News', 'Foundation', 'Careers'].map((x) => L(x)) },
    { title: 'Business', slug: 'support', links: ['Member Support', 'FAQs', 'Fraud Prevention', 'Financial Hardship Assistance'].map((x) => L(x)) },
  ],
  member: { routing: 'Routing # 324078721', nmls: 'NMLS: 582825', cta: L('Become a Member') },
  legal: [{ ...L('Privacy Policies & Disclosures'), kind: 'ketch-preferences' }, ...['Website Accessibility Statement', 'Patriot Act Notice', 'eSign Consent'].map((x) => L(x))],
  disclosures: ['*APR = Annual Percentage Rate. Rate based on creditworthiness and term of loan. Rates are subject to change at any time and are not guaranteed.<br> **APY = Annual Percentage Yield.', 'We provide links to third party partners independent from Granite Credit Union. These links are provided only as a convenience. We do not manage the content of those sites. The privacy and security policies of external websites will differ from those of Granite Credit Union.'],
  copyright: { year: '©2026', owner: 'Granite Credit Union. All Rights Reserved.' },
  badges: [{ src: U + 'logo-ncua.png', alt: 'NCUA Insured', label: 'Insured by NCUA' }, { src: U + 'logo-ehl.png', alt: 'Equal Housing Lender', label: 'Equal Housing Lender' }],
};
