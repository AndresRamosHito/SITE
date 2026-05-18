// Orchidarc — shared front-end behaviour

// Mobile nav
const t = document.getElementById('navtoggle');
const l = document.getElementById('navlinks');
if (t && l) {
  t.addEventListener('click', () => l.classList.toggle('open'));
  l.querySelectorAll('a').forEach(a => a.addEventListener('click', () => l.classList.remove('open')));
}

// Reveal-on-scroll with fail-safe visibility.
// Content must never remain invisible if IntersectionObserver fails, loads late, or is blocked.
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const showReveal = (el) => {
  el.classList.add('in');
  el.style.opacity = '1';
  el.style.visibility = 'visible';
  el.style.transform = 'none';
};

if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && showReveal(e.target)),
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  );
  revealEls.forEach(el => io.observe(el));

  // Safety net: reveal all content shortly after load even if intersection never fires.
  window.setTimeout(() => revealEls.forEach(showReveal), 900);
} else {
  revealEls.forEach(showReveal);
}

// Homepage specimen-card factual cleanup.
// Keeps the minified homepage stable while aligning visible labels with the herbarium/species pages.
const specimenCards = Array.from(document.querySelectorAll('#species .specimen'));
const updateSpecimenCard = (name, updates) => {
  const card = specimenCards.find(el => (el.querySelector('.specimen__name')?.textContent || '').trim() === name);
  if (!card) return;

  if (updates.status) {
    const status = card.querySelector('.specimen__status');
    if (status) status.textContent = updates.status;
  }
  if (updates.desc) {
    const desc = card.querySelector('.specimen__desc');
    if (desc) desc.innerHTML = updates.desc;
  }
  if (updates.href) {
    const link = card.querySelector('.specimen__link');
    if (link) link.href = updates.href;
  }
  if (updates.img) {
    const img = card.querySelector('.specimen__img img');
    if (img) img.src = updates.img;
  }
};

updateSpecimenCard('Acineta barkeri', {
  status: 'NOM-059: A · Endemic',
  desc: 'Pendant cloud-forest inflorescences and one of Orchidarc\'s flagship monitoring species in Veracruz.'
});

updateSpecimenCard('Prosthechea vitellina', {
  status: 'NOM-059: Pr · Reserve population',
  desc: 'A protected cloud-forest epiphyte, locally abundant within mature riparian forest at the Orchidarc reserve.',
  img: 'images/prosthechea-vitellina-plate.jpg'
});

updateSpecimenCard('Epidendrum parkinsonianum', {
  status: 'Canopy specialist · Monitoring record',
  desc: 'The pendant-leaf giant, night-scented and increasingly rare in accessible forest.'
});

const specimensGrid = document.querySelector('#species .specimens');
if (specimensGrid && !document.querySelector('#species a[href="mexipedium-xerophyticum.html"]')) {
  const mexipedium = document.createElement('article');
  mexipedium.className = 'specimen';
  mexipedium.innerHTML = `
    <div class="specimen__plate"><span>OA — Plate VI</span><span>Oaxaca</span></div>
    <div class="specimen__img"><img src="images/mexipedium-xerophyticum.jpg" alt="Mexipedium xerophyticum"></div>
    <h3 class="specimen__name">Mexipedium xerophyticum</h3>
    <p class="specimen__author">V.A.Albert & M.W.Chase</p>
    <span class="specimen__status">NOM-059: P · IUCN: CR</span>
    <p class="specimen__desc">A monotypic Mexican slipper orchid from Oaxaca's limestone cliffs and one of the highest-risk species in the herbarium.</p>
    <a href="mexipedium-xerophyticum.html" class="specimen__link">Read profile</a>
  `;
  specimensGrid.appendChild(mexipedium);
}

// Orchids of Mexico documentary page refinements.
// Keeps the static page editable while allowing fast image/layout tuning.
const path = window.location.pathname.split('/').pop() || 'index.html';
if (path === 'orchids-of-mexico.html') {
  const style = document.createElement('style');
  style.textContent = `
    .thread-card img { opacity: .82 !important; }
    .thread-overlay { background: linear-gradient(to top, rgba(0,0,0,.62), rgba(0,0,0,.04)) !important; }
    .thread-card::after { content:""; position:absolute; inset:0; background:rgba(255,244,224,.06); pointer-events:none; z-index:1; }
    .thread-content { text-shadow: 0 2px 18px rgba(0,0,0,.58); }
  `;
  document.head.appendChild(style);

  const synopsisFigure = document.querySelector('.essay-section .essay-grid figure.essay-image');
  if (synopsisFigure) {
    const img = synopsisFigure.querySelector('img');
    const cap = synopsisFigure.querySelector('figcaption');
    if (img) {
      img.src = 'images/orchids-of-mexico/sthanhopea-tigrina.png';
      img.alt = 'Stanhopea tigrina flower from Mexico';
      img.className = 'vertical';
    }
    if (cap) cap.textContent = 'Stanhopea tigrina, one of Mexico’s most spectacular orchid lineages.';
  }
}

// Homepage link to the Orchids of Mexico feature page.
if ((path === '' || path === 'index.html') && !document.querySelector('a[href="orchids-of-mexico.html"]')) {
  const filmsSection = document.querySelector('#films .indev');
  if (filmsSection) {
    const p = document.createElement('p');
    p.style.marginTop = '22px';
    p.innerHTML = '<a class="btn" href="orchids-of-mexico.html">Open the feature project page</a>';
    filmsSection.appendChild(p);
  }
}

// Films page link to the Orchids of Mexico feature page.
if (path === 'films.html' && !document.querySelector('.indev a[href="orchids-of-mexico.html"]')) {
  const indev = document.querySelector('.indev');
  if (indev) {
    const p = document.createElement('p');
    p.style.marginTop = '22px';
    p.innerHTML = '<a class="btn" href="orchids-of-mexico.html">Open project page</a>';
    indev.appendChild(p);
  }
}

// Subscribe form
// To wire to a real provider, replace the body of the submit handler with a fetch().
// Buttondown example:
//   fetch('https://buttondown.com/api/emails/embed-subscribe/orchidarc', { method:'POST', body: new FormData(f) })
const f = document.getElementById('subform');
const m = document.getElementById('submsg');
const e = document.getElementById('subemail');
if (f) {
  f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const v = (e.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      m.textContent = '— Please enter a valid email';
      return;
    }
    m.textContent = "— Thank you. We'll be in touch from the cloud forest.";
    e.value = '';
  });
}
