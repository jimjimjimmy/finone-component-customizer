import { section, layout } from '../lib.js';

/* Share Certificate Calculator  (ACF: content-block > .wysiwyg > #fin-cd-calculator)
   NOTE: on the engineer's /blocks page the mount point #fin-cd-calculator is EMPTY (the widget is injected by a
   vendor script that is not loaded there), so there is no engineer markup to copy 1:1. This component is built to the
   brief: Initial Deposit, APY %, Term Length pills, live compound-interest result. Styles: calculator.css (tokens only).
   props: deposit, apy, term, terms[], id */
export const TERMS = [3, 6, 12, 18, 24, 36, 48, 60];

/* Pure maths, shared with the DOM wiring and unit-checkable:
   APY is the effective annual yield, so growth over `months` is (1 + apy)^(months / 12). */
export function certificateGrowth({ deposit, apy, months }) {
  const principal = Math.max(0, Number(deposit) || 0);
  const rate = Math.max(0, Number(apy) || 0) / 100;
  const ending = principal * Math.pow(1 + rate, months / 12);
  return { principal, ending, dividends: ending - principal };
}
const usd = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export function certificateCalculator(p = {}) {
  const { deposit = 10000, apy = 4.2, term = 24, terms = TERMS, id = 'fin-cd-calculator' } = p;
  const r = certificateGrowth({ deposit, apy, months: term });
  const pills = terms.map((m) => `<label class="fin-cd__pill"><input type="radio" name="fin-cd-term" value="${m}"${m === term ? ' checked' : ''}><span>${m} mo</span></label>`).join('');
  const inner = `<div id="${id}"><form class="fin-cd" data-fin-cd novalidate onsubmit="return false">
    <h3 class="fin-cd__title">Share Certificate Calculator</h3>
    <div class="fin-cd__grid">
      <div class="fin-cd__field"><label for="${id}-deposit">Initial Deposit</label>
        <div class="fin-cd__input"><span aria-hidden="true">$</span><input id="${id}-deposit" name="deposit" type="number" inputmode="decimal" min="0" step="100" value="${deposit}"></div></div>
      <div class="fin-cd__field"><label for="${id}-apy">APY %</label>
        <div class="fin-cd__input"><input id="${id}-apy" name="apy" type="number" inputmode="decimal" min="0" max="25" step="0.01" value="${apy}"><span aria-hidden="true">%</span></div></div>
    </div>
    <fieldset class="fin-cd__terms"><legend>Term Length</legend><div class="fin-cd__pills" role="radiogroup">${pills}</div></fieldset>
    <div class="fin-cd__result" aria-live="polite">
      <div><span class="fin-cd__label">Dividends earned</span><strong data-out="dividends">${usd(r.dividends)}</strong></div>
      <div><span class="fin-cd__label">Balance at maturity</span><strong data-out="ending">${usd(r.ending)}</strong></div>
    </div>
    <p class="fin-cd__fine">Assumes dividends compound at the stated APY and are left in the certificate. Estimate only.</p>
  </form></div>`;
  return section({}, layout('content-block', { pt: 100, pb: 100 }, `<div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-10 "><div class="wysiwyg fade-animate">${inner}</div></div></div></div>`));
}

/* Behaviour: call once after the HTML is in the DOM (idempotent). */
export function wireCertificateCalculator(root = document) {
  root.querySelectorAll('[data-fin-cd]').forEach((f) => {
    if (f.dataset.wired) return; f.dataset.wired = '1';
    const out = (k) => f.querySelector(`[data-out="${k}"]`);
    const run = () => {
      const months = Number(f.querySelector('input[name="fin-cd-term"]:checked')?.value || 12);
      const r = certificateGrowth({ deposit: f.deposit.value, apy: f.apy.value, months });
      out('dividends').textContent = usd(r.dividends); out('ending').textContent = usd(r.ending);
    };
    f.addEventListener('input', run); f.addEventListener('change', run);
  });
}
