(() => {
  'use strict';
  // Table 2 of the ACS submission. Amplitude and frequency measurements remain distinct.
  const genera = {
    Cattleya: {
      taxon: 'Cattleya walkeriana · two independently collected pools',
      description: 'The stiffest and least frequency-sensitive matrix. Storage exceeds loss throughout both measured frequency windows. No crossover was observed; a permanent elastic solid has not been established.',
      pools: [
        {id: 'S1', plateau: '342–706 kPa', g1: '505 kPa', exponent: '0.14 ± 0.01', cross: 'Not observed', time: '>100 s (bound)', note: 'No crossover down to 0.01 rad s⁻¹. The critical linear strain spans 0.026–0.039%.'},
        {id: 'S2', plateau: '593–679 kPa', g1: '479 kPa', exponent: '0.12 ± 0.00', cross: 'Not observed', time: '>200 s (bound)', note: 'No crossover down to 0.005 rad s⁻¹. The critical linear strain spans 0.076–0.11%.'}
      ]
    },
    Laelia: {
      taxon: 'Laelia anceps · one independently collected pool',
      description: 'An intermediate-stiffness matrix with a crossover at the second-lowest measured frequency. Its nominal crossover timescale is much longer than in the softer crossing materials.',
      pools: [{id: 'S1', plateau: '25.2–33 kPa', g1: '16.7 kPa', exponent: '0.25 ± 0.01', cross: '0.00862 rad s⁻¹', time: '116 s', note: 'Crossover modulus: 2.93 kPa. Repeated loads and sweeps are not independent biological pools.'}]
    },
    Phalaenopsis: {
      taxon: 'White-flowered hybrid close to P. amabilis · two pools',
      description: 'The two pools have similar power-law exponents but different crossover outcomes. The microscopy area fraction is overlap-limited and must not be interpreted as a three-dimensional cellular fraction.',
      pools: [
        {id: 'S1', plateau: '23.4 kPa', g1: '8.38 kPa', exponent: '0.34 ± 0.00', cross: 'Not observed', time: '>200 s (bound)', note: 'Tan δ approached unity but no crossover was reached at 0.005 rad s⁻¹.'},
        {id: 'S2', plateau: '31.3–36.7 kPa', g1: '14.2 kPa', exponent: '0.33 ± 0.01', cross: '0.202 rad s⁻¹', time: '4.95 s', note: 'Crossover modulus: 6.28 kPa. The pools were collected at least seven weeks apart.'}
      ]
    },
    Cymbidium: {
      taxon: 'Two different commercial hybrids · one pool per hybrid',
      description: 'Crossover frequency differs about tenfold between the two hybrids, while their exponents vary less. S2 is the primary spectrum because S1 was measured slightly above its linear strain limit.',
      pools: [
        {id: 'S1 · comparison', plateau: '21.4 kPa', g1: '4.93 kPa', exponent: '0.49 ± 0.02', cross: '4.33 rad s⁻¹', time: '0.231 s', note: 'Hybrid close to C. lowianum. Frequency-sweep strain 0.25% exceeds the 0.082% linear limit. Gc: 11.9 kPa.'},
        {id: 'S2 · primary', plateau: '33.4 kPa', g1: '6.94 kPa', exponent: '0.37 ± 0.02', cross: '0.436 rad s⁻¹', time: '2.29 s', note: 'Hybrid close to C. Ben Singer. Frequency-sweep strain 0.10% is within the linear regime. Gc: 4.63 kPa.'}
      ]
    },
    Dendrobium: {
      taxon: 'Cut-flower hybrid sold as Bombay · two pools',
      description: 'The softest and most frequency-sensitive material. S1 is loss-dominated at lower frequencies and crosses at 19 rad s⁻¹. Its low-frequency slopes approach but do not reach terminal-liquid scaling.',
      pools: [
        {id: 'S1', plateau: '3.71–3.98 kPa', g1: '0.622 kPa', exponent: '0.71 ± 0.02', cross: '19 rad s⁻¹', time: '0.0526 s', note: 'Crossover modulus: 6.26 kPa. The lowest frequency is 0.026 rad s⁻¹; complete terminal relaxation was not observed.'},
        {id: 'S2', plateau: '6.51 kPa', g1: 'Not measured', exponent: 'Not measured', cross: 'Not measured', time: 'Not available', note: 'This pool supplies amplitude, creep, and thermal measurements but no analysed frequency spectrum. Frequency descriptors must not be copied from S1.'}
      ]
    }
  };
  const explorer = document.querySelector('[data-stigma-explorer]');
  const detail = document.getElementById('genus-detail');
  if (!explorer || !detail) return;
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const metric = (name, value) => `<div><dt>${name}</dt><dd>${escape(value)}</dd></div>`;
  const render = name => {
    const genus = genera[name];
    if (!genus) return;
    for (const button of explorer.querySelectorAll('[data-genus]')) button.setAttribute('aria-pressed', String(button.dataset.genus === name));
    detail.innerHTML = `<div class="stigma-genus-heading"><h3><i>${escape(name)}</i></h3><span>${escape(genus.taxon)}</span></div><p>${escape(genus.description)}</p><div class="stigma-pool-cards">${genus.pools.map(pool => `<article class="stigma-pool-card"><h4>Pool ${escape(pool.id)}</h4><dl>${metric('Plateau G′p · 10 rad s⁻¹', pool.plateau)}${metric('G′ at 1 rad s⁻¹', pool.g1)}${metric('n′ · 1–100 rad s⁻¹', pool.exponent)}${metric('Crossover ωc', pool.cross)}${metric('Nominal timescale · 1/ωc', pool.time)}</dl><p>${escape(pool.note)}</p></article>`).join('')}</div><p class="stigma-small">Nominal crossover times are reciprocals of measured angular frequencies, not oscillation periods or the longest relaxation time. Bounds mark unobserved crossovers. Fit errors are rounded standard errors.</p>`;
  };
  for (const button of explorer.querySelectorAll('[data-genus]')) button.addEventListener('click', () => render(button.dataset.genus));
  render('Cattleya');
  explorer.hidden = false;
})();
