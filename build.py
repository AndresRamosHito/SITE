"""
Orchidarc site generator — v2.

Rebuilds every page with the new expanded image set (~90 images) and adds:
  - 4 new species profile pages (anceps, halbingeriana, furfuracea,
    epidendrum parkinsonianum)
  - 1 new research page (RAR Climate Replicator + viscidium bioadhesive)
  - Expanded herbarium index (~24 species)
  - Better imagery throughout existing pages
  - Proper "Research" nav link (now points to research.html)

Run: python3 build.py
"""
from pathlib import Path

OUT = Path(__file__).parent
IMG = "images"  # local folder, referenced in HTML

# ============================================================
# SHARED CHROME (head, ticker, nav, footer)
# ============================================================

def head(title: str, description: str, og_image: str = f"{IMG}/hero-cloud-forest.jpg") -> str:
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{og_image}">
<meta name="theme-color" content="#0f2418">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,0..100;1,9..144,300..700,0..100&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
"""

TICKER = """<div class="ticker" aria-hidden="true">
  <div class="ticker__track">
    <span>UK Charity no. 1208062</span>
    <span>Field Season 2026 — Veracruz × Oaxaca</span>
    <span>IUCN SSC Orchid Specialist Group</span>
    <span>Reserve: 14 ha cloud forest, Ixhuacán de los Reyes</span>
    <span>Now in development — Orchids of Mexico (feature documentary)</span>
    <span>UK Charity no. 1208062</span>
    <span>Field Season 2026 — Veracruz × Oaxaca</span>
    <span>IUCN SSC Orchid Specialist Group</span>
    <span>Reserve: 14 ha cloud forest, Ixhuacán de los Reyes</span>
    <span>Now in development — Orchids of Mexico (feature documentary)</span>
  </div>
</div>
"""

def nav(active: str = "") -> str:
    items = [
        ("films",    "films.html",     "Films"),
        ("species",  "herbarium.html", "Species"),
        ("research", "research.html",  "Research"),
        ("about",    "about.html",     "About"),
        ("stories",  "stories.html",   "Stories"),
        ("store",    "store.html",     "Store"),
    ]
    links = "\n".join(
        f'      <a href="{href}" class="{ "is-active" if k==active else "" }">{label}</a>'
        for k, href, label in items
    )
    return f"""<header class="nav">
  <div class="wrap nav__inner">
    <a href="index.html" class="brand">
      <span class="brand__mark">O</span>
      <span>
        <span class="brand__text">Orchidarc</span>
        <span class="brand__sub">Est. 2022 · Sheffield, UK</span>
      </span>
    </a>
    <nav class="nav__links" id="navlinks">
{links}
    </nav>
    <button class="nav__toggle" id="navtoggle" aria-label="Menu">Menu</button>
    <a href="take-action.html" class="nav__cta">Take Action</a>
  </div>
</header>
"""

FOOTER = """<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div class="foot__brand">
        <h2>Orchidarc.</h2>
        <p>UK-registered conservation NGO working to protect the wild orchids of Mexico through research, action and cinema.</p>
      </div>
      <div class="foot__col">
        <h5>Work</h5>
        <ul>
          <li><a href="films.html">Films</a></li>
          <li><a href="herbarium.html">Herbarium</a></li>
          <li><a href="research.html">Research</a></li>
          <li><a href="cypripedium.html">Cypripedium</a></li>
          <li><a href="stories.html">Stories</a></li>
        </ul>
      </div>
      <div class="foot__col">
        <h5>Get involved</h5>
        <ul>
          <li><a href="take-action.html">Donate</a></li>
          <li><a href="mexico-tours.html">Mexico tours</a></li>
          <li><a href="store.html">Store</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="socials.html">Socials</a></li>
        </ul>
      </div>
      <div class="foot__col">
        <h5>Contact</h5>
        <ul>
          <li><a href="mailto:andresr@orchidarc.org">andresr@orchidarc.org</a></li>
          <li><a href="tel:+447771483822">+44 (0)7771 483822</a></li>
          <li>Mexico · UK · Brasil</li>
          <li>Charity no. 1208062</li>
        </ul>
      </div>
    </div>
    <div class="foot__bottom">
      <span>© Orchidarc 2022–2026 — All rights reserved</span>
      <span>Designed in the cloud forest · Built with care</span>
    </div>
  </div>
</footer>
<script src="app.js"></script>
</body>
</html>"""

def page(title, desc, body, active="", og=f"{IMG}/hero-cloud-forest.jpg"):
    return head(title, desc, og) + TICKER + nav(active) + body + FOOTER


# ============================================================
# SHARED BLOCKS
# ============================================================

def pageheader(eyebrow, title_html, lede=""):
    lede_html = f'<p class="ph__lede">{lede}</p>' if lede else ""
    return f"""<section class="ph wrap">
  <span class="ph__eyebrow">{eyebrow}</span>
  <h1 class="ph__title">{title_html}</h1>
  {lede_html}
</section>
"""


# ============================================================
# HOME
# ============================================================

HOME_BODY = f"""
<section class="hero wrap">
  <div class="hero__meta">
    <span>I. — Field Notes</span>
    <span>Veracruz · 19°25′N · 97°06′W</span>
    <span>Vol. IV / 2026</span>
  </div>

  <h1 class="hero__title">
    Saving the <em>wild orchids</em> of <span class="pollen">México</span>.
  </h1>

  <figure class="hero__frame">
    <img src="{IMG}/hero-cloud-forest.jpg" alt="Cloud forest canopy in Veracruz" loading="eager">
    <figcaption class="hero__caption">PL. 01 — Cloud forest canopy, <b>Cofre de Perote</b>, Veracruz</figcaption>
  </figure>

  <div class="hero__lede">
    <p>Orchidarc is a UK-registered conservation NGO working in the cloud forests of Mexico. We protect wild orchid populations through field research, habitat restoration, IUCN Red List assessment — and the documentary films we make to bring those forests to the world.</p>
    <aside>
      <dl>
        <dt>— Founded</dt><dd>2022, Sheffield, UK</dd>
        <dt>— Charity no.</dt><dd>1208062</dd>
        <dt>— Reserve</dt><dd>14 ha · Ixhuacán de los Reyes</dd>
        <dt>— Endangered species protected</dt><dd>3 (Mexican Red List)</dd>
        <dt>— Native orchids on site</dt><dd>≈ 50 species</dd>
      </dl>
    </aside>
  </div>
</section>

<section class="section wrap reveal" id="discovery">
  <div class="section__head">
    <span class="section__num">§ 02 — Discovery</span>
    <div>
      <h2 class="section__title">A new <em>nothogenus</em><br>from the mountains of Veracruz.</h2>
      <p class="section__lede">Our first formal taxonomic contribution: a hybrid genus that emerges where the cloud forests of central Mexico meet two ancient lineages.</p>
    </div>
  </div>

  <div class="discovery">
    <div class="discovery__img">
      <div class="discovery__plate">
        <span>SPECIMEN — OA · 0001</span>
        <span>VER / MX</span>
      </div>
      <img src="{IMG}/dinedema-mariae.jpg" alt="× Dinedema mariae">
    </div>
    <div class="discovery__txt">
      <h3><span class="x">×</span>Dinedema mariae</h3>
      <p>The parent genera are <em>Nidema</em> (nest) and <em>Dinema</em> (crown). The result is <em>Dinedema</em> — the nest-crown — the first new orchid taxon described and published by Orchidarc, endemic to the Mexican cloud forest belt.</p>
      <dl class="discovery__meta">
        <div><dt>Subtribe</dt><dd>Laeliinae</dd></div>
        <div><dt>Habitat</dt><dd>Cloud forest, Veracruz</dd></div>
        <div><dt>Status</dt><dd>Newly described, 2025</dd></div>
        <div><dt>Distribution</dt><dd>Endemic to Mexico</dd></div>
      </dl>
      <a class="btn" href="https://www.researchgate.net/publication/393387931_A_new_nothogenus_and_a_new_nothospecies_in_the_subtribe_Laeliinae_Orchidaceae_from_Mexico" target="_blank" rel="noopener">Read the paper</a>
    </div>
  </div>
</section>

<section class="section wrap reveal" id="films">
  <div class="section__head">
    <span class="section__num">§ 03 — Cinema</span>
    <div>
      <h2 class="section__title">Documentary as <em>conservation</em>.</h2>
      <p class="section__lede">Orchidarc's films treat orchids as protagonists, not props. Filmed in the cloud forests of Veracruz and Oaxaca, in close partnership with the communities that have lived alongside them for centuries.</p>
    </div>
  </div>

  <div class="films">

    <article class="film">
      <a href="https://www.youtube.com/watch?v=9ozJdv3ggG0" target="_blank" rel="noopener" class="film__poster">
        <img src="{IMG}/film-lily-of-allsaints.jpg" alt="Lily of Allsaints">
        <div class="film__play"><span>▶</span></div>
      </a>
      <div class="film__meta"><span>2025 · 35 min · Documentary</span><span>EN / ES</span></div>
      <h3 class="film__title"><em>Lily of Allsaints</em></h3>
      <p class="film__desc">The sacred orchids of Mexico — <em>Laelia anceps</em> on the altars of the Day of the Dead, the cloud forests where it still grows wild, and the people who have woven it into a thousand years of ceremony.</p>
      <div class="film__lang">
        <a href="https://www.youtube.com/watch?v=9ozJdv3ggG0&t=1108s" target="_blank" rel="noopener">Watch (EN) ↗</a>
        <a href="https://www.youtube.com/watch?v=-iy_hTD1Fsc&t=1376s" target="_blank" rel="noopener">Ver (ES) ↗</a>
      </div>
      <span class="film__award">Best Feature Environmental Documentary, FICAA Mexico City, 2025</span>
    </article>

    <article class="film">
      <a href="https://www.youtube.com/watch?v=XlOR4z7b86s" target="_blank" rel="noopener" class="film__poster">
        <img src="{IMG}/film-spring-orchids.jpg" alt="Spring Orchids: Mexico">
        <div class="film__play"><span>▶</span></div>
      </a>
      <div class="film__meta"><span>2025 · 19 min · Short</span><span>EN / ES</span></div>
      <h3 class="film__title"><em>Spring Orchids: Mexico</em></h3>
      <p class="film__desc">Spring in Mexico is the warmest, driest season — and it brings forth unimaginable beauty. A montage-style portrait of the orchids that bloom when the forest is at its thirstiest.</p>
      <div class="film__lang">
        <a href="https://www.youtube.com/watch?v=XlOR4z7b86s" target="_blank" rel="noopener">Watch ↗</a>
      </div>
    </article>

  </div>
</section>

<section class="urgent reveal">
  <div class="urgent__bg" aria-hidden="true"></div>
  <div class="urgent__inner">
    <div class="urgent__txt">
      <span class="urgent__tag">⚠ Urgent Conservation Action</span>
      <h2 class="urgent__title">The largest <em>Cypripedium</em> population recorded in Mesoamerica.</h2>
      <p>Following the discovery of the largest known Cypripedium population in Mesoamerica, we are racing against habitat loss and illegal collection to ensure its survival. Targeted surveys, in-situ protection and species reintroduction are underway across the Cofre de Perote cloud forest belt.</p>
      <a href="cypripedium.html" class="btn btn--filled" style="border-color:var(--ochre);background:var(--ochre);color:var(--forest)">Learn more</a>
    </div>
    <div class="urgent__img">
      <img src="{IMG}/cypripedium.jpg" alt="Cypripedium">
    </div>
  </div>
</section>

<section class="section wrap reveal" id="species">
  <div class="section__head">
    <span class="section__num">§ 04 — Field Notebook</span>
    <div>
      <h2 class="section__title">Species <em>under our care</em>.</h2>
      <p class="section__lede">From the showy and fragrant to the cryptic and miniature — selected entries from the orchids we monitor, propagate and assess for the IUCN Red List.</p>
    </div>
  </div>

  <div class="specimens">

    <article class="specimen">
      <div class="specimen__plate"><span>OA — Plate II</span><span>Coll. 2022</span></div>
      <div class="specimen__img"><img src="{IMG}/anceps-flowers.JPG" alt="Laelia anceps"></div>
      <h3 class="specimen__name">Laelia anceps</h3>
      <p class="specimen__author">Lindl.</p>
      <span class="specimen__status">Cultural icon · Widespread</span>
      <p class="specimen__desc">Mexico's most iconic orchid — the lily of the altars. Flowers every November on the cliffs and oak branches of the eastern cordilleras, just in time for the Day of the Dead.</p>
      <a href="laelia-anceps.html" class="specimen__link">Read profile</a>
    </article>

    <article class="specimen">
      <div class="specimen__plate"><span>OA — Plate III</span><span>Coll. 2022</span></div>
      <div class="specimen__img"><img src="{IMG}/a-barkeri-flowers.jpg" alt="Acineta barkeri"></div>
      <h3 class="specimen__name">Acineta barkeri</h3>
      <p class="specimen__author">(Bateman) Lindl.</p>
      <span class="specimen__status">Endangered · Endemic</span>
      <p class="specimen__desc">Pendant inflorescences cascade from cloud-forest branches. Heavily pressured by illegal collection — one of the flagship species of our long-term monitoring programme.</p>
      <a href="acineta-barkeri.html" class="specimen__link">Read profile</a>
    </article>

    <article class="specimen">
      <div class="specimen__plate"><span>OA — Plate IV</span><span>Coll. 2021</span></div>
      <div class="specimen__img"><img src="{IMG}/prosthechea-vitellina.jpg" alt="Prosthechea vitellina"></div>
      <h3 class="specimen__name">Prosthechea vitellina</h3>
      <p class="specimen__author">(Lindl.) W.E.Higgins</p>
      <span class="specimen__status">Endangered · Abundant on reserve</span>
      <p class="specimen__desc">A Central American icon. Despite formal endangered status, this species thrives within our reserve — a quiet conservation success.</p>
      <a href="prosthechea-vitellina.html" class="specimen__link">Read profile</a>
    </article>

    <article class="specimen">
      <div class="specimen__plate"><span>OA — Plate V</span><span>Coll. 2023</span></div>
      <div class="specimen__img"><img src="{IMG}/epi-parkinsonianum-grand.JPG" alt="Epidendrum parkinsonianum"></div>
      <h3 class="specimen__name">Epidendrum parkinsonianum</h3>
      <p class="specimen__author">Hook.</p>
      <span class="specimen__status">Canopy specialist · Under monitoring</span>
      <p class="specimen__desc">The pendant-leaf giant — specimens in the canopy can reach over a metre long. Night-scented, moth-pollinated, and increasingly rare in accessible forest.</p>
      <a href="epidendrum-parkinsonianum.html" class="specimen__link">Read profile</a>
    </article>

  </div>

  <p style="text-align:center;margin-top:48px"><a class="btn" href="herbarium.html">See the full herbarium</a></p>
</section>

<section class="section wrap reveal">
  <div class="section__head">
    <span class="section__num">§ 05 — Research</span>
    <div>
      <h2 class="section__title">The <em>RAR Climate Replicator</em>.</h2>
      <p class="section__lede">An automated habitat-replication system for orchid conservation — built in-house to solve one of the hardest problems in the field.</p>
    </div>
  </div>
  <div class="essay">
    <div class="essay__media">
      <img class="a" src="{IMG}/Climate-simulator.JPG" alt="RAR Climate Replicator">
    </div>
    <div class="essay__txt">
      <h3>Recreating the cloud forest, <em>indoors</em>.</h3>
      <p>Most laboratory-grown orchid seedlings die during deflasking — the transition from sterile in-vitro culture to open air. The RAR Climate Replicator is our response: a modular automated greenhouse that reproduces the specific temperature, humidity, airflow and light cycles of the habitats these orchids came from.</p>
      <p>It lets us acclimatize vulnerable seedlings under conditions they can actually survive, and gives us a controlled testbed for studying microhabitat requirements in species we can't risk experimenting on in the wild.</p>
      <a href="research.html" class="btn">See the research</a>
    </div>
  </div>
</section>

<section class="section wrap reveal" id="about">
  <div class="section__head">
    <span class="section__num">§ 06 — About</span>
    <div>
      <h2 class="section__title">A small organisation, working <em>across three disciplines</em>.</h2>
    </div>
  </div>

  <div class="about">
    <div class="about__col">
      <p class="about__lede">Orchidarc sits at the intersection of <em>field biology, conservation practice and documentary cinema</em> — three disciplines that, in our work, refuse to be separated.</p>
      <div class="about__stats">
        <div><div class="stat__num">≈1300</div><div class="stat__label">Orchid species in Mexico</div></div>
        <div><div class="stat__num">≈600</div><div class="stat__label">Endemic to Mexico</div></div>
        <div><div class="stat__num">14 ha</div><div class="stat__label">Cloud forest under management</div></div>
        <div><div class="stat__num">2022</div><div class="stat__label">Year founded · Sheffield, UK</div></div>
      </div>
    </div>
    <div class="about__col">
      <p>Founded in 2022 and registered with the UK Charity Commission, Orchidarc operates primarily in Veracruz and Oaxaca, with research collaborations in the United Kingdom, Japan, Ecuador and Costa Rica.</p>
      <p>We are a small team — and that's intentional. Every project we take on is led directly by the people doing the field work, the science, and the storytelling.</p>
      <div class="about__pillars">
        <div class="pillar"><span class="pillar__num">01 — Research</span><div><h4>Field & laboratory</h4><p>Taxonomy, IUCN Red List assessment, orchid bioadhesives, and the RAR Climate Replicator for habitat simulation.</p></div></div>
        <div class="pillar"><span class="pillar__num">02 — Conservation</span><div><h4>In-situ & ex-situ</h4><p>Reserve management, symbiotic propagation, and reintroduction of threatened species into protected cloud forest sites.</p></div></div>
        <div class="pillar"><span class="pillar__num">03 — Cinema</span><div><h4>Documentary as a tool</h4><p>Long-form films that bring the cloud forest to international audiences — and the funding it needs back home.</p></div></div>
      </div>
      <a href="about.html" class="btn" style="margin-top:32px">More about us</a>
    </div>
  </div>
</section>

<section class="action reveal" id="action">
  <div class="action__inner">
    <div><h2 class="action__title">Ready to take the <em>next step</em>?</h2></div>
    <div class="action__txt">
      <p>Three concrete ways to support the wild orchids of Mexico — choose the one that fits.</p>
      <div class="action__cards">
        <a class="action__card" href="take-action.html"><div><h4>Become a contributor</h4><p>Recurring or one-time gift</p></div><span>↗</span></a>
        <a class="action__card" href="mexico-tours.html"><div><h4>Join a Mexico orchid expedition</h4><p>Field trips, July–August</p></div><span>↗</span></a>
        <a class="action__card" href="store.html"><div><h4>The Laelia collection</h4><p>Garments · Sales fund the reserve</p></div><span>↗</span></a>
      </div>
    </div>
  </div>
</section>

<section class="subscribe wrap reveal">
  <div class="subscribe__inner">
    <div>
      <h3>Field <em>dispatches</em>.</h3>
      <p>Occasional letters from the cloud forest — new species accounts, film releases, expedition reports. No spam, ever.</p>
    </div>
    <div>
      <form id="subform" novalidate>
        <input type="email" id="subemail" placeholder="your@email.com" required>
        <button type="submit">Subscribe</button>
      </form>
      <div class="subscribe__msg" id="submsg">&nbsp;</div>
    </div>
  </div>
</section>
"""


# ============================================================
# CYPRIPEDIUM — expanded with image gallery
# ============================================================

CYPRIPEDIUM = pageheader(
    "Urgent Campaign · Mesoamerica",
    "The largest <em>Cypripedium</em><br>population in Mesoamerica.",
    "A discovery that changed everything we thought we knew about the genus in Central America — and the race against time to keep it safe."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 64px">
    <img src="{IMG}/aerial-cofre-de-perote.jpg" alt="Cloud forest aerial — Cypripedium habitat">
    <figcaption class="hero__caption">PL. 02 — Drone survey, <b>Ciudad Mendoza</b>, Veracruz</figcaption>
  </figure>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">In 2023, working in the eastern slopes of the Pico de Orizaba massif, our team confirmed what local botanists had long suspected: a population of <em>Cypripedium</em> larger than any previously documented in Mesoamerica.</p>

    <h3>What we found</h3>
    <p>Cypripediums — slipper orchids — are the iconic terrestrial orchids of the temperate northern hemisphere. In Mexico they reach the southern edge of their range, where the genus barely persists in scattered cloud forest pockets. The population we documented is unlike anything previously published for the region.</p>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:320px;margin-bottom:64px">
    <figure class="g"><img src="{IMG}/cypripedium-a.JPG" alt="Cypripedium in habitat"><figcaption>In habitat</figcaption></figure>
    <figure class="g g--tall"><img src="{IMG}/cypripedium-b.JPG" alt="Cypripedium flower detail"><figcaption>Flower detail</figcaption></figure>
    <figure class="g"><img src="{IMG}/cypripedium-molle.jpeg" alt="Cypripedium molle"><figcaption><em>Cypripedium molle</em></figcaption></figure>
    <figure class="g g--wide"><img src="{IMG}/cypripedium-size%20comp.JPG" alt="Size comparison"><figcaption>Size comparison with a human hand</figcaption></figure>
    <figure class="g"><img src="{IMG}/cypripedium-size-comp-b.JPG" alt="Size comparison detail"><figcaption>Inflorescence scale</figcaption></figure>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <h3>The threats</h3>
    <p>Three pressures dominate. <em>Habitat conversion</em> — even small clearings for pasture and milpa permanently disrupt the orchid's mycorrhizal partners. <em>Illegal collection</em> — Cypripediums are highly desirable to private collectors and command high prices on the black market. <em>Climate</em> — the cloud forest belt that supports the genus is migrating uphill faster than the orchids can.</p>

    <h3>Our response</h3>
    <ul class="checklist">
      <li><b>Population mapping.</b> A complete census of mature individuals using ground surveys and drone-based imagery.</li>
      <li><b>IUCN Red List assessment.</b> The first formal regional assessment of the species, led by trained Orchidarc assessors within the IUCN SSC Orchid Specialist Group.</li>
      <li><b>In-situ protection.</b> Working with state authorities to extend protected status across the core habitat.</li>
      <li><b>Ex-situ insurance.</b> Limited symbiotic propagation as a safeguard, kept offsite under controlled conditions.</li>
      <li><b>Community engagement.</b> Workshops with adjacent communities — the long-term future of the population depends on the people who live around it.</li>
    </ul>

    <h3>How to support this work</h3>
    <p>Cypripedium conservation is slow, expensive, and unglamorous. It requires multi-year monitoring, careful permits, and patient relationships with local communities and authorities. Every contribution helps keep this work going.</p>

    <p style="margin-top:32px"><a class="btn btn--filled" href="take-action.html">Support the campaign</a></p>
  </div>
</section>
"""


# ============================================================
# ACINETA BARKERI — with illegal trade section
# ============================================================

ACINETA = pageheader(
    "Species Profile · Plate III",
    "<em>Acineta barkeri</em>",
    "Bateman's Acineta — endangered, fragrant, endemic to the cloud forests of Veracruz."
) + f"""
<section class="wrap reveal">
  <div class="profile">
    <div class="profile__img">
      <img src="{IMG}/acineta-barkeri-front.JPG" alt="Acineta barkeri">
    </div>
    <div class="profile__data">
      <dl class="datasheet">
        <dt>Binomial</dt><dd><em>Acineta barkeri</em></dd>
        <dt>Author</dt><dd>(Bateman) Lindl.</dd>
        <dt>Family</dt><dd>Orchidaceae</dd>
        <dt>Subfamily</dt><dd>Epidendroideae</dd>
        <dt>Habit</dt><dd>Pendant epiphyte</dd>
        <dt>Habitat</dt><dd>Cloud forest, 1,200–1,800 m</dd>
        <dt>Distribution</dt><dd>Endemic — Veracruz, MX</dd>
        <dt>Mexican Red List</dt><dd>Endangered</dd>
        <dt>IUCN status</dt><dd>Not yet assessed</dd>
        <dt>Flowering</dt><dd>May–July</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:300px;margin:48px 0 64px">
    <figure class="g g--wide"><img src="{IMG}/a-barkeri-flowers.jpg" alt="Acineta flowers"><figcaption>Inflorescence</figcaption></figure>
    <figure class="g"><img src="{IMG}/acineta-canopy.jpg" alt="In canopy"><figcaption>In the canopy</figcaption></figure>
    <figure class="g"><img src="{IMG}/Acineta_barkeri_insitu.JPG" alt="In situ"><figcaption>In situ</figcaption></figure>
    <figure class="g g--wide"><img src="{IMG}/acineta-ground.jpg" alt="Fallen specimen"><figcaption>Ground-level observation</figcaption></figure>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">Few orchids announce themselves with the same drama as <em>Acineta barkeri</em>. The pendant inflorescences emerge downward from the pseudobulbs, dripping waxy yellow flowers that fill the surrounding air with a heavy, almost gardenia-like fragrance.</p>

    <h3>Morphology</h3>
    <p>Robust, ovoid pseudobulbs each bear two to three pleated leaves up to 60 cm long. The pendant inflorescence may carry six to twelve flowers, each 7–8 cm across, in shades of butter yellow with maroon spotting on the lip. The fragrance, strongest in early morning, is what draws its specialised euglossine bee pollinators.</p>

    <h3>Ecology</h3>
    <p>The species depends on intact mid-elevation cloud forest with a stable humidity regime. Mature individuals are typically found on the trunks of large oaks and <em>Liquidambar</em>, where the pendant flower spike has the vertical clearance to develop properly — making the species particularly vulnerable to selective logging that removes the largest trees.</p>
  </div>
</section>

<section class="wrap reveal" style="margin:80px 0">
  <div class="trade-block">
    <div class="trade-block__txt">
      <span class="ph__eyebrow" style="color:var(--ochre-2)">Threats — the trade</span>
      <h3>Sold by the <em>roadside</em>.</h3>
      <p>Across rural Veracruz, wild-collected orchids are still openly sold at roadside stalls and informal markets — including endangered species like <em>Acineta barkeri</em>. Each plant you see has been cut from a tree, often with the host branch, and will not propagate again.</p>
      <p>Documenting these sites is part of our monitoring work. We don't publish locations, but the photographic record is a direct input to enforcement conversations with state environmental authorities.</p>
    </div>
    <div class="trade-block__imgs">
      <img src="{IMG}/a-barkeri-illegal-trade.jpg" alt="Wild-collected Acineta on sale at a roadside market">
      <img src="{IMG}/a-barkeri-illegal-trade-b.jpg" alt="Wild-collected Acineta on sale">
    </div>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <h3>Our work</h3>
    <p>Orchidarc maintains a long-term monitoring plot for <em>A. barkeri</em> within our reserve. We're documenting flowering phenology, mapping the wild population, and working toward the first formal IUCN assessment for the species. We presented preliminary work on its conservation at the Encuentro Mexicano de Orquideología in Oaxaca.</p>
  </div>
</section>
"""


# ============================================================
# PROSTHECHEA VITELLINA — with in-situ image
# ============================================================

PROSTHECHEA = pageheader(
    "Species Profile · Plate IV",
    "<em>Prosthechea vitellina</em>",
    "A Central American icon. Endangered in the wild — but quietly thriving on our reserve."
) + f"""
<section class="wrap reveal">
  <div class="profile">
    <div class="profile__img">
      <img src="{IMG}/prosthechea-vitellina.jpg" alt="Prosthechea vitellina">
    </div>
    <div class="profile__data">
      <dl class="datasheet">
        <dt>Binomial</dt><dd><em>Prosthechea vitellina</em></dd>
        <dt>Author</dt><dd>(Lindl.) W.E.Higgins</dd>
        <dt>Synonym</dt><dd><em>Encyclia vitellina</em></dd>
        <dt>Family</dt><dd>Orchidaceae</dd>
        <dt>Habit</dt><dd>Cool-growing epiphyte</dd>
        <dt>Habitat</dt><dd>Cloud forest, 1,500–2,400 m</dd>
        <dt>Distribution</dt><dd>Mexico → Nicaragua</dd>
        <dt>Mexican Red List</dt><dd>Endangered</dd>
        <dt>IUCN status</dt><dd>Not yet assessed</dd>
        <dt>Flowering</dt><dd>Sept–Dec</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <figure class="hero__frame" style="margin:48px 0 64px;aspect-ratio:16/9">
    <img src="{IMG}/vitellina-situ.jpg" alt="Prosthechea vitellina in habitat">
    <figcaption class="hero__caption">In situ — Orchidarc Reserve, Veracruz</figcaption>
  </figure>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">Few orchids in cultivation are as instantly recognisable. The vermilion-orange flowers of <em>Prosthechea vitellina</em> have been celebrated since the species was first introduced to European collections in the 19th century — yet in the wild it remains in retreat across most of its range.</p>

    <h3>The reserve population</h3>
    <p>Within our reserve, <em>P. vitellina</em> is one of the most abundant epiphytic orchids — a striking contrast with its broader status as an endangered species. The population is centred on the high-canopy oaks of our riparian primary forest fragment, where humidity remains high through the dry season.</p>

    <h3>Why the reserve matters</h3>
    <p>The local abundance illustrates a broader principle: even small, well-managed forest fragments can sustain dense populations of species that are otherwise in decline. Protecting these fragments — and preventing the loss of the large host trees the orchids depend on — is among the highest-leverage actions we take.</p>

    <h3>Our work</h3>
    <p>We track flowering individuals annually, document seed-set in a subset of the population, and use the reserve population as a source of provenance-matched seed for symbiotic propagation. We are working toward a formal IUCN regional assessment for the species.</p>
  </div>
</section>
"""


# ============================================================
# LAELIA ANCEPS — NEW
# ============================================================

LAELIA_ANCEPS = pageheader(
    "Species Profile · Plate II",
    "<em>Laelia anceps</em>",
    "The lily of the altars. Mexico's cultural orchid, blooming exactly when the Day of the Dead arrives."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 64px;aspect-ratio:21/9">
    <img src="{IMG}/anceps-cliff.jpg" alt="Laelia anceps on cliffs">
    <figcaption class="hero__caption">PL. — <em>Laelia anceps</em> on cliff face, Veracruz</figcaption>
  </figure>
</section>

<section class="wrap reveal">
  <div class="profile">
    <div class="profile__img">
      <img src="{IMG}/anceps-flowers.JPG" alt="Laelia anceps flower detail">
    </div>
    <div class="profile__data">
      <dl class="datasheet">
        <dt>Binomial</dt><dd><em>Laelia anceps</em></dd>
        <dt>Author</dt><dd>Lindl.</dd>
        <dt>Family</dt><dd>Orchidaceae</dd>
        <dt>Habit</dt><dd>Epiphyte &amp; lithophyte</dd>
        <dt>Habitat</dt><dd>Oak &amp; pine-oak forest, cliff faces; 800–2,100 m</dd>
        <dt>Distribution</dt><dd>Mexico (widespread) → Honduras</dd>
        <dt>Mexican Red List</dt><dd>Subject to special protection</dd>
        <dt>Flowering</dt><dd>October–December</dd>
        <dt>Cultural use</dt><dd>Day of the Dead altars</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:280px;margin:48px 0 64px">
    <figure class="g"><img src="{IMG}/anceps-flowers-b.JPG" alt="Anceps flowers"><figcaption>Inflorescence</figcaption></figure>
    <figure class="g g--tall"><img src="{IMG}/anceps-forest.jpg" alt="In cloud forest"><figcaption>In the forest</figcaption></figure>
    <figure class="g"><img src="{IMG}/anceps-situ.jpg" alt="In situ"><figcaption>In situ</figcaption></figure>
    <figure class="g"><img src="{IMG}/L_anceps_insitu.jpg" alt="Epiphytic specimen"><figcaption>Epiphytic habit</figcaption></figure>
    <figure class="g g--wide"><img src="{IMG}/anceps-day-of-the-dead-collection.jpg" alt="Day of the Dead altar with anceps"><figcaption>Altar collection, Day of the Dead</figcaption></figure>
    <figure class="g"><img src="{IMG}/anceps-situ-flower.JPG" alt="Flower close-up"><figcaption>Flower close-up</figcaption></figure>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">If Mexico had a national orchid, <em>Laelia anceps</em> would be an unavoidable candidate. It flowers in November — exactly the week of the Day of the Dead — and for as long as anyone can remember, its long inflorescences have crowned the altars that Mexicans build for their ancestors.</p>

    <h3>A cliff orchid</h3>
    <p>Unlike most epiphytic Laelias, <em>L. anceps</em> thrives as a lithophyte, growing directly on limestone cliffs and rocky outcrops as readily as on oak branches. Populations can cover entire cliff faces in colour when the plants bloom in unison.</p>

    <h3>Cultural life</h3>
    <p>The species is woven into Mexican ceremonial life across a broad swath of the country. In Veracruz and Puebla, it is still harvested — sometimes sustainably, often not — for Day of the Dead arrangements. Lily of Allsaints, our 2025 documentary, follows this relationship across the cloud forest and the cemeteries where the orchid ends up.</p>

    <h3>Conservation</h3>
    <p>Although locally abundant in places, <em>L. anceps</em> populations have declined sharply near roads and settlements because of collection pressure. It is listed under special protection in Mexico (NOM-059-SEMARNAT). Our work focuses on mapping the remaining dense wild populations and documenting the sustainable harvest practices that still exist in some communities.</p>
  </div>
</section>
"""


# ============================================================
# LAELIA HALBINGERIANA — NEW
# ============================================================

LAELIA_HALBINGERIANA = pageheader(
    "Species Profile",
    "<em>Laelia halbingeriana</em>",
    "A recently described cloud-forest Laelia from the eastern Sierra Madre. Endemic, narrow-range, and still poorly known."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 64px;aspect-ratio:16/9">
    <img src="{IMG}/andres-with-halbingeriana.jpg" alt="Andrés with Laelia halbingeriana in habitat">
    <figcaption class="hero__caption"><em>Laelia halbingeriana</em> in situ — Veracruz cloud forest</figcaption>
  </figure>
</section>

<section class="wrap reveal">
  <div class="profile">
    <div class="profile__img">
      <img src="{IMG}/l-halbingeriana.jpg" alt="Laelia halbingeriana">
    </div>
    <div class="profile__data">
      <dl class="datasheet">
        <dt>Binomial</dt><dd><em>Laelia halbingeriana</em></dd>
        <dt>Author</dt><dd>Salazar &amp; Soto Arenas</dd>
        <dt>Family</dt><dd>Orchidaceae</dd>
        <dt>Habit</dt><dd>Epiphyte</dd>
        <dt>Habitat</dt><dd>Cloud forest, ~1,500 m</dd>
        <dt>Distribution</dt><dd>Endemic — eastern Sierra Madre, MX</dd>
        <dt>Mexican Red List</dt><dd>Not yet evaluated</dd>
        <dt>IUCN status</dt><dd>Not yet assessed</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:280px;margin:48px 0 64px">
    <figure class="g"><img src="{IMG}/l-halbingeriana-a.JPG" alt="Halbingeriana flower"><figcaption>Flower detail</figcaption></figure>
    <figure class="g"><img src="{IMG}/l-halbingeriana-b.JPG" alt=""><figcaption>Inflorescence</figcaption></figure>
    <figure class="g"><img src="{IMG}/l-halbingeriana-c.JPG" alt=""><figcaption>Habit</figcaption></figure>
    <figure class="g"><img src="{IMG}/l-halbingeriana-d.JPG" alt=""><figcaption>Lip detail</figcaption></figure>
    <figure class="g"><img src="{IMG}/l-halbingeriana-e.JPG" alt=""><figcaption>In situ</figcaption></figure>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">Described relatively recently and endemic to a narrow band of cloud forest in eastern Mexico, <em>Laelia halbingeriana</em> is the kind of species whose entire known global population could fit within a short afternoon's walk.</p>

    <h3>A narrow range</h3>
    <p>The species is known only from a small area of the eastern Sierra Madre, at cloud forest elevations where humidity remains high year-round. The specific host-tree preferences and pollination ecology remain largely undocumented — a reminder of how much work there is still to do on even conspicuous Mexican orchids.</p>

    <h3>Our work</h3>
    <p>Orchidarc maintains monitoring plots for the species within our reserve system. We are collecting phenological data (flowering timing, flower counts, seed set) that will support the first formal IUCN assessment of the species.</p>

    <p class="muted"><em>Note: some of the scientific details above (authorship, exact elevation, habit) should be verified against the original description. Andrés to confirm before final publication.</em></p>
  </div>
</section>
"""


# ============================================================
# LAELIA FURFURACEA — NEW
# ============================================================

LAELIA_FURFURACEA = pageheader(
    "Species Profile",
    "<em>Laelia furfuracea</em>",
    "The scaly Laelia of the Oaxacan highlands — a ceremonial cousin of anceps, with its own deep cultural life."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 64px;aspect-ratio:16/9">
    <img src="{IMG}/furfuracea-situ.jpg" alt="Laelia furfuracea in habitat">
    <figcaption class="hero__caption"><em>Laelia furfuracea</em> — Oaxaca</figcaption>
  </figure>
</section>

<section class="wrap reveal">
  <div class="profile">
    <div class="profile__img">
      <img src="{IMG}/laelia-furfuracea.JPG" alt="Laelia furfuracea">
    </div>
    <div class="profile__data">
      <dl class="datasheet">
        <dt>Binomial</dt><dd><em>Laelia furfuracea</em></dd>
        <dt>Author</dt><dd>Lindl.</dd>
        <dt>Family</dt><dd>Orchidaceae</dd>
        <dt>Habit</dt><dd>Epiphyte &amp; lithophyte</dd>
        <dt>Habitat</dt><dd>Pine-oak &amp; cloud forest, 1,600–2,500 m</dd>
        <dt>Distribution</dt><dd>Endemic to Mexico — Oaxaca</dd>
        <dt>Mexican Red List</dt><dd>Subject to special protection</dd>
        <dt>Flowering</dt><dd>October–December</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:280px;margin:48px 0 64px">
    <figure class="g g--wide"><img src="{IMG}/furfuracea-grand.jpg" alt=""><figcaption>In full bloom</figcaption></figure>
    <figure class="g"><img src="{IMG}/furfuracea-situ-b.jpg" alt=""><figcaption>On oak</figcaption></figure>
    <figure class="g"><img src="{IMG}/L_furfuracea_insitu.JPG" alt=""><figcaption>In situ</figcaption></figure>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">In the Oaxacan highlands, <em>Laelia furfuracea</em> occupies the same ceremonial and ecological niche that <em>L. anceps</em> fills further north — a late-autumn bloomer, tied to Day of the Dead observances, and under steady pressure from habitat loss and harvest.</p>

    <h3>Morphology</h3>
    <p>The specific epithet <em>furfuracea</em> (scaly, mealy) refers to the distinctive silvery scales on the pseudobulbs. Flowers are smaller and more richly coloured than <em>L. anceps</em>, with a deep rose-magenta lip. The species is widely cultivated both in Mexico and internationally.</p>

    <h3>Distribution</h3>
    <p>Endemic to Oaxaca, the species occurs in scattered populations in pine-oak and cloud forest at mid-to-high elevation. Cliff faces, rocky outcrops and the mossy branches of old oaks are typical substrates.</p>

    <h3>Cultural significance</h3>
    <p>In many Oaxacan communities, <em>L. furfuracea</em> — locally known as <em>flor de muerto</em> alongside marigold and <em>L. anceps</em> — is harvested for altar arrangements. Sustainable-use traditions exist, but are increasingly pressured by commercial demand in regional markets.</p>
  </div>
</section>
"""


# ============================================================
# EPIDENDRUM PARKINSONIANUM — NEW
# ============================================================

EPIDENDRUM = pageheader(
    "Species Profile",
    "<em>Epidendrum</em><br><em>parkinsonianum</em>",
    "The pendant-leaf giant of the cloud forest canopy — a species that can only be properly seen by climbing into the trees where it lives."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 64px;aspect-ratio:16/10">
    <img src="{IMG}/epi-parkinsonianum-grand.JPG" alt="Epidendrum parkinsonianum">
    <figcaption class="hero__caption">A mature specimen in the canopy</figcaption>
  </figure>
</section>

<section class="wrap reveal">
  <div class="profile">
    <div class="profile__img">
      <img src="{IMG}/epi-parkinsonianum.JPG" alt="Epidendrum parkinsonianum">
    </div>
    <div class="profile__data">
      <dl class="datasheet">
        <dt>Binomial</dt><dd><em>Epidendrum parkinsonianum</em></dd>
        <dt>Author</dt><dd>Hook.</dd>
        <dt>Family</dt><dd>Orchidaceae</dd>
        <dt>Habit</dt><dd>Pendant epiphyte</dd>
        <dt>Habitat</dt><dd>Cloud forest &amp; wet oak forest, 1,000–2,000 m</dd>
        <dt>Distribution</dt><dd>Mexico → Panama</dd>
        <dt>Leaf length</dt><dd>Often &gt; 1 m</dd>
        <dt>Flower</dt><dd>Night-scented, star-shaped</dd>
        <dt>Pollination</dt><dd>Nocturnal moths</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:300px;margin:48px 0 64px">
    <figure class="g"><img src="{IMG}/epi-parkinsonianum-grand-b.JPG" alt=""><figcaption>Specimen scale</figcaption></figure>
    <figure class="g"><img src="{IMG}/Epidendrum_insitu.jpg" alt=""><figcaption>In the canopy</figcaption></figure>
    <figure class="g"><img src="{IMG}/Epidendrum_insitu2.jpg" alt=""><figcaption>Habit</figcaption></figure>
  </div>
</section>

<section class="section wrap reveal">
  <div class="prose">
    <p class="prose__lede">Most of the orchids we write about can be held in a hand. <em>Epidendrum parkinsonianum</em> cannot. Mature specimens carry pendant, strap-like leaves well over a metre long, hanging from cloud forest branches far overhead — visible from the ground only as dark silhouettes against the sky.</p>

    <h3>A canopy species</h3>
    <p>The species is a strict canopy specialist of wet oak and cloud forests from Mexico south to Panama. Its pendant growth form is a direct adaptation to high-light, high-humidity life on horizontal branches — where water drains quickly but fog keeps the plant hydrated.</p>

    <h3>Night flowers</h3>
    <p>Flowers are large, pale green or ivory, star-shaped, and open in the afternoon to release their fragrance at night. They are pollinated by long-tongued moths — a system we know exists at this genus level, but that has been directly observed remarkably few times in the wild for this species.</p>

    <h3>Conservation</h3>
    <p>Selective logging of the largest host trees is the primary threat. When a 40-metre-tall oak is felled, every canopy epiphyte falls with it — and in the case of <em>E. parkinsonianum</em>, that is often a mature individual of several decades' age. We work with private landowners to protect large-diameter host trees in the landscapes where the species persists.</p>
  </div>
</section>
"""


# ============================================================
# RESEARCH — NEW page (RAR Climate Replicator + Viscidium)
# ============================================================

RESEARCH = pageheader(
    "Research",
    "The <em>science</em> behind the conservation.",
    "Orchidarc is a research-led organisation. Two active programmes sit behind our fieldwork: the RAR Climate Replicator, for habitat simulation; and a biomaterials programme on the orchid pollination adhesive."
) + f"""
<section class="section wrap reveal">
  <div class="section__head">
    <span class="section__num">§ 01</span>
    <div>
      <h2 class="section__title">RAR <em>Climate Replicator</em>.</h2>
      <p class="section__lede">A modular automated greenhouse system developed to simulate orchid habitats for research, conservation and cultivation.</p>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <figure class="hero__frame" style="aspect-ratio:16/9;margin-bottom:48px">
    <img src="{IMG}/Climate-simulator.JPG" alt="RAR Climate Replicator">
    <figcaption class="hero__caption">RAR Climate Replicator — prototype chamber</figcaption>
  </figure>
</section>

<section class="section wrap reveal" style="padding-top:0">
  <div class="prose">
    <p class="prose__lede">The RAR Climate Replicator is an automated habitat-replication system built in-house by Orchidarc. By integrating sensors, programmable climate control, LED lighting, automated watering and remote monitoring, it recreates the temperature, humidity, airflow and water conditions required by sensitive orchid species.</p>

    <h3>What it does</h3>
    <p>At its core, the system is a controlled micro-greenhouse — but one designed specifically to reproduce the environmental conditions of natural orchid habitats, not the homogenised conditions of a standard nursery.</p>

    <ul class="checklist">
      <li><b>Climate control.</b> Precise regulation of temperature, humidity and airflow, matched to target habitats.</li>
      <li><b>Lighting simulation.</b> Programmable LEDs reproduce natural light cycles — sunrise, daylight, sunset transitions included.</li>
      <li><b>Automated watering.</b> Pumps and valves run on scheduled, sensor-triggered, or habitat-specific programmes.</li>
      <li><b>Habitat replication.</b> Configurable for cloud forest microclimates, flowing-water habitats, or limestone seepage systems.</li>
      <li><b>Remote monitoring.</b> The system transmits data to a server for real-time monitoring and remote control.</li>
    </ul>

    <h3>Why it matters for conservation</h3>
    <p>The biggest bottleneck in laboratory-based orchid conservation is deflasking — the moment an in-vitro seedling leaves its sterile flask and has to survive in the open air. Mortality at this stage routinely exceeds 50%, and is often much higher. The RAR Climate Replicator gives us a gradient: the seedling moves from sterile flask, through a controlled chamber that reproduces its home habitat, before facing the full variability of the open greenhouse or the wild.</p>

    <p>It also lets us ask questions we cannot ask in the field — what happens to <em>Cypripedium</em> seedlings under simulated climate projections for 2050? What humidity regime is actually lethal for <em>Prosthechea vitellina</em>? The chamber becomes an experimental microcosm.</p>

    <h3>Current versions</h3>
    <p>Several configurations are in development, each tuned to a different habitat type: running-water systems for rheophytic species; temporary-immersion systems for <em>Cypripedium</em> mycorrhizal co-culture; high-humidity spray systems for cloud-forest epiphytes.</p>
  </div>
</section>

<section class="wrap reveal">
  <div class="gallery" style="grid-auto-rows:300px;margin:32px 0 80px">
    <figure class="g"><img src="{IMG}/Climate-simulator-b.JPG" alt="Climate Replicator detail"><figcaption>Control electronics</figcaption></figure>
    <figure class="g"><img src="{IMG}/Climate-simulator-c.JPG" alt="Climate Replicator detail"><figcaption>Chamber interior</figcaption></figure>
    <figure class="g"><img src="{IMG}/Climate-simulator-d.JPG" alt="Climate Replicator detail"><figcaption>Water-cycle module</figcaption></figure>
  </div>
</section>

<hr class="hairline">

<section class="section wrap reveal">
  <div class="section__head">
    <span class="section__num">§ 02</span>
    <div>
      <h2 class="section__title">The <em>viscidium</em>.</h2>
      <p class="section__lede">An orchid bioadhesive, the size of a sesame seed, that holds together one of evolution's most elaborate pollination systems. The subject of our PhD research at the University of Tokyo.</p>
    </div>
  </div>
</section>

<section class="wrap reveal">
  <figure class="hero__frame" style="aspect-ratio:16/9;background:#fff;margin-bottom:48px">
    <img src="{IMG}/stigmatic-gel-diagram.png" alt="Viscidium and stigmatic gel diagram" style="object-fit:contain;filter:none">
  </figure>
</section>

<section class="section wrap reveal" style="padding-top:0">
  <div class="prose">
    <p class="prose__lede">Orchid pollination does not rely on loose pollen. Instead, each flower packs its entire pollen production into two waxy masses — pollinia — that must be transferred whole, by a pollinator, to the stigma of another flower. Holding this system together is a tiny, specialised glue: the viscidium.</p>

    <h3>What the viscidium does</h3>
    <p>The viscidium is a droplet of bioadhesive located at the base of the pollinarium. When a pollinator brushes past, the viscidium attaches the pollinia to the pollinator's body — a bee's back, a moth's tongue, a bird's beak. Minutes later, when the pollinator visits the next flower, the pollinia are deposited on a different, receptive, stigmatic surface.</p>

    <p>The viscidium must be an extraordinary material. It has to be sticky enough to bond instantly on contact, durable enough to survive minutes or hours on a moving pollinator, and responsive enough to release cleanly onto the stigma at the right moment. It is, in effect, a natural smart adhesive — and almost nothing is known about how it works at a mechanical or chemical level.</p>

    <h3>Our research</h3>
    <p>Orchidarc's ongoing doctoral research at the University of Tokyo, in partnership with the University of Sheffield, is studying the viscidium and the related stigmatic gels across a range of orchid genera. The goal is twofold: to understand an under-studied piece of orchid biology, and to characterise a potentially novel class of bio-inspired adhesives that may have practical applications — including in medicine, where tissue adhesives face similar challenges of bonding-in-wet-conditions.</p>

    <p>This is the kind of research where conservation and science feed each other directly: the species we study are the species we also protect in the field, and understanding their reproductive mechanics is a direct input to effective conservation.</p>
  </div>
</section>

<section class="section wrap reveal" style="border-top:1px solid var(--rule)">
  <h3 class="section__title" style="margin-bottom:48px">Publications &amp; <em>conferences</em></h3>
  <div class="affiliations">
    <div><h5>Paper — 2025</h5><p>A new nothogenus and a new nothospecies in the subtribe Laeliinae (Orchidaceae) from Mexico. <em>Phytotaxa.</em> <a href="https://www.researchgate.net/publication/393387931_A_new_nothogenus_and_a_new_nothospecies_in_the_subtribe_Laeliinae_Orchidaceae_from_Mexico" target="_blank" rel="noopener">Read ↗</a></p></div>
    <div><h5>Conference — 2024</h5><p>World Orchid Conference, Tainan, Taiwan.</p></div>
    <div><h5>Conference — 2024</h5><p>Adhesion Society meeting, Oxford, UK.</p></div>
    <div><h5>Conference — 2025</h5><p>Andean Orchid Conference, Cuenca, Ecuador.</p></div>
    <div><h5>Conference — 2022</h5><p>Encuentro Mexicano de Orquideología, Oaxaca, Mexico.</p></div>
    <div><h5>Upcoming</h5><p>Encuentro Mexicano de Orquideología, November 2026 — presenting RAR Climate Replicator research.</p></div>
  </div>
</section>
"""


# ============================================================
# EXTINCT STRENGTH (unchanged essay)
# ============================================================

EXTINCT = pageheader(
    "Essay · 2025",
    "Extinct <em>strength</em>.",
    "What the bee orchid can tell us about the bumblebee that disappeared."
) + f"""
<section class="wrap reveal">
  <figure class="essay__hero">
    <img src="{IMG}/ophrys-apifera.png" alt="Ophrys apifera">
    <figcaption>Fig. 1 — <em>Ophrys apifera</em>, the bee orchid. The labellum mimics the body of a female bee.</figcaption>
  </figure>
</section>

<section class="section wrap reveal">
  <article class="prose prose--essay">
    <p class="prose__lede">Bee orchids (<em>Ophrys apifera</em>) are among the most studied flowers in Europe. They are also among the loneliest. The species today reproduces almost entirely through self-pollination — a strange evolutionary endpoint for a flower whose entire architecture is built around a partner that no longer exists.</p>

    <p>Across the genus <em>Ophrys</em>, flowers mimic the body of a female bee with extraordinary precision: the velvety texture, the iridescent blue speculum, even the volatile cocktail that imitates the bee's sex pheromones. Male bees are deceived into attempting to mate with the flower, and in doing so they pick up the orchid's pollinia. It is one of the most remarkable cases of sexual mimicry in the plant kingdom.</p>

    <h3>The bee that isn't there</h3>
    <p>For <em>Ophrys apifera</em>, the bee that was being mimicked has not been reliably observed for centuries. The flower's morphology suggests a long-tongued bumblebee of a particular size and grip — a form that does not match any extant European species. We are looking, in effect, at the silhouette of an extinction.</p>

    <blockquote class="essay__pull">"Every orchid is a fossil of its pollinator. The flower outlives the bee."</blockquote>

    <h3>Reading the flower</h3>
    <p>The genius of the system is that the flower itself preserves data. By measuring the labellum's pseudo-abdomen, the angle and depth of the column, and the precise placement of the viscidium that deposits the pollinia, we can reconstruct constraints on the missing bee: roughly how large it was, how strong its grip needed to be, the geometry of its approach.</p>

    <figure class="essay__inline">
      <img src="{IMG}/bee-orchid-diagram.png" alt="Bee orchid pollination diagram">
      <figcaption>Fig. 2 — Pollination geometry of <em>Ophrys apifera</em>, with reconstructed bee dimensions.</figcaption>
    </figure>

    <p>This is not unlike forensic anatomy. The flower is a cast of a body that no longer walks the earth. And the orchid's switch to self-pollination — the so-called "selfing transition" — is best understood not as an evolutionary triumph but as a quiet act of survival in the absence of a partner.</p>

    <h3>Why this matters now</h3>
    <p>The bee orchid story is not unique. As pollinator populations decline globally, an unknown number of plant species are entering the same trajectory: maintained for now by the architecture of a relationship that no longer functions, with selfing or vegetative propagation as a temporary stay against extinction. Some of these flowers will outlive their pollinators by centuries. Others won't.</p>

    <p>Studying the orchids that have already crossed this line gives us a vocabulary for what's coming.</p>

    <hr class="hairline">
    <p class="byline"><em>Andrés Ramos · Orchidarc · 2025</em></p>
  </article>
</section>
"""


# ============================================================
# HERBARIUM — EXPANDED to ~24 species
# ============================================================

HERBARIUM_ENTRIES = [
    # (name, author, status, range, image, href)
    ("Laelia anceps",            "Lindl.",                  "Cultural icon",      "Mexico (widespread)",      f"{IMG}/anceps-flowers.JPG",              "laelia-anceps.html"),
    ("Laelia halbingeriana",     "Salazar &amp; Soto Arenas","Narrow endemic",    "Eastern Sierra Madre",    f"{IMG}/l-halbingeriana.jpg",             "laelia-halbingeriana.html"),
    ("Laelia furfuracea",        "Lindl.",                  "Under protection",   "Endemic · Oaxaca",         f"{IMG}/laelia-furfuracea.JPG",           "laelia-furfuracea.html"),
    ("Laelia speciosa",          "(Kunth) Schltr.",         "Under protection",   "Endemic · Central MX",     f"{IMG}/laelia-speciosa.jpg",             "#"),
    ("Laelia albida",            "Bateman ex Lindl.",       "Cultural use",       "Mexico",                    f"{IMG}/laelia-albida-black.jpg",         "#"),
    ("Acineta barkeri",          "(Bateman) Lindl.",        "Endangered",         "Endemic · Veracruz",       f"{IMG}/a-barkeri-flowers.jpg",     "acineta-barkeri.html"),
    ("Prosthechea vitellina",    "(Lindl.) W.E.Higgins",    "Endangered",         "MX → Nicaragua",            f"{IMG}/prosthechea-vitellina.jpg",       "prosthechea-vitellina.html"),
    ("Prosthechea cochleata",    "(L.) W.E.Higgins",        "Under monitoring",   "MX → South America",        f"{IMG}/prosthechea-cochleata.JPG",       "#"),
    ("Cypripedium spp.",         "—",                       "In assessment",      "Cofre de Perote",           f"{IMG}/cypripedium.jpg",                 "cypripedium.html"),
    ("× Dinedema mariae",        "Orchidarc, 2025",         "Newly described",    "Endemic · Veracruz",       f"{IMG}/dinedema-mariae.jpg",             "#"),
    ("Epidendrum parkinsonianum","Hook.",                   "Canopy specialist",  "MX → Panama",               f"{IMG}/epi-parkinsonianum.JPG",          "epidendrum-parkinsonianum.html"),
    ("Mormodes maculata",        "(Klotzsch) L.O.Williams", "Under monitoring",   "Mexico (cloud forest)",     f"{IMG}/mormodes-maculata.jpg",           "#"),
    ("Gongora galeata",          "(Lindl.) Rchb.f.",        "Under monitoring",   "Endemic · Mexico",          f"{IMG}/gongora-galeata.jpg",             "#"),
    ("Rhynchostele maculata",    "(La Llave &amp; Lex.) Soto Arenas &amp; Salazar","Under monitoring","MX &amp; Guatemala", f"{IMG}/rhynchostele-maculata.JPG",   "#"),
    ("Rhynchostele membranacea", "(Lindl.) Soto Arenas &amp; Salazar","Under monitoring","Mexico",             f"{IMG}/rhynchostele-membranacea.JPG",    "#"),
    ("Artorima erubescens",      "(Lindl.) Dressler &amp; Pollard","Endemic",     "Oaxaca highlands",         f"{IMG}/artorima.JPG",                    "#"),
    ("Alamania punicea",         "Lex.",                    "Cliff specialist",   "Endemic · Oaxaca",          f"{IMG}/alamania.JPG",                    "#"),
    ("Bletia adenocarpa",        "Rchb.f.",                 "Under monitoring",   "Mexico",                    f"{IMG}/bletia-adenocarpa.JPG",           "#"),
    ("Habenaria spp.",           "—",                       "Under monitoring",   "Cloud forest terrestrial",  f"{IMG}/habenaria.jpg",                   "#"),
    ("Lepanthes spp.",           "—",                       "Miniatures",         "Cloud forest",              f"{IMG}/lepanthes-mini.jpg",              "#"),
    ("Pabstiella biriricensis",  "—",                       "Under study",        "Cloud forest",              f"{IMG}/pabstiella.jpg",                  "#"),
    ("Acianthera spp.",          "—",                       "Under monitoring",   "Cloud forest",              f"{IMG}/acianthera-macro.jpg",                  "#"),
    ("Pleurothallis spp.",       "—",                       "Under monitoring",   "Cloud forest",              f"{IMG}/Pleurothallis_cultivado.jpg",               "#"),
    ("Trichosalpinx spp.",       "—",                       "Under monitoring",   "Cloud forest",              f"{IMG}/Trichosalpinx_cultivado.jpg",               "#"),
    ("Meiracyllium spp.",        "—",                       "Under monitoring",   "Mexico &amp; Guatemala",    f"{IMG}/Meriacylium_cultivado.jpg",                "#"),
    ("Coelia macrostachya",      "Lindl.",                  "Under monitoring",   "Mexico",                    f"{IMG}/Coelia_macrostachya_insitu.jpg",         "#"),
    ("Cranichis spp.",           "—",                       "Terrestrial",        "Cloud forest",              f"{IMG}/cranichis.JPG",                   "#"),
    ("Funkiella spp.",           "—",                       "Terrestrial",        "Mexico",                    f"{IMG}/funkiella.JPG",                   "#"),
    ("Pterostemma karwinskii",   "Schltr.",                 "Endemic",            "Mexico",                    f"{IMG}/p-karwinskii.jpg",                "#"),
    ("Unknown species",          "Under study",             "Not yet identified", "Veracruz cloud forest",     f"{IMG}/SinID.jpg",             "#"),
]

def herbarium_card(name, author, status, range_, img, href):
    return f"""<article class="hb">
  <a href="{href}">
    <div class="hb__img"><img src="{img}" alt="{name}" loading="lazy"></div>
    <div class="hb__meta"><span>{status}</span><span>{range_}</span></div>
    <h3 class="hb__name"><em>{name}</em></h3>
    <p class="hb__author">{author}</p>
  </a>
</article>"""

HERBARIUM = pageheader(
    "Digital Herbarium · OA",
    "The <em>herbarium</em>.",
    "An ongoing index of the orchid species we encounter, document and monitor in the field. Each plate links to the underlying notes, photographs and conservation status."
) + f"""
<section class="section wrap reveal">
  <div class="hb-grid">
    {''.join(herbarium_card(*e) for e in HERBARIUM_ENTRIES)}
  </div>
  <p class="muted" style="margin-top:64px;text-align:center">{len(HERBARIUM_ENTRIES)} entries and growing. More are added as field work continues. Want to contribute a record? <a href="mailto:andresr@orchidarc.org">Get in touch</a>.</p>
</section>
"""


# ============================================================
# GALLERY — rebuilt around new image set
# ============================================================

GALLERY_IMAGES = [
    (f"{IMG}/anceps-cliff.jpg",             "Laelia anceps on cliff face",          "tall"),
    (f"{IMG}/waterfall.jpg",                "Cloud forest waterfall",               "wide"),
    (f"{IMG}/l-halbingeriana-c.JPG",        "Laelia halbingeriana",                 ""),
    (f"{IMG}/a-barkeri-flowers.jpg",  "Acineta barkeri",                       "tall"),
    (f"{IMG}/aerial-cofre-de-perote.jpg",   "Aerial · Cofre de Perote",              "wide"),
    (f"{IMG}/cypripedium-a.JPG",            "Cypripedium",                          ""),
    (f"{IMG}/epi-parkinsonianum-grand.JPG", "Epidendrum parkinsonianum",            ""),
    (f"{IMG}/dinedema-moreflowers.jpg",     "× Dinedema mariae",                    "tall"),
    (f"{IMG}/researchers-in-canopy.jpg",    "Researchers in the canopy",             "wide"),
    (f"{IMG}/anceps-day-of-the-dead-collection.jpg",   "Day of the Dead altar",                ""),
    (f"{IMG}/hero-cloud-forest.jpg",        "Cloud forest canopy",                  "tall"),
    (f"{IMG}/reserve-ixhuacan.jpg",         "Reserve, Ixhuacán de los Reyes",       ""),
    (f"{IMG}/cloud-rock-habitat.jpg",       "Cloud forest rock habitat",            ""),
    (f"{IMG}/furfuracea-grand.jpg",         "Laelia furfuracea in bloom",           "wide"),
    (f"{IMG}/Lepanthes%201.jpg",              "Lepanthes — miniature",                 ""),
    (f"{IMG}/vitellina-situ.jpg","Prosthechea vitellina in situ",       "tall"),
    (f"{IMG}/orchid-resc8e.jpg",            "Orchid rescue",                        ""),
    (f"{IMG}/andres-with-halbingeriana.jpg","Fieldwork · Laelia halbingeriana",     ""),
]

def gallery_tile(src, cap, mod):
    return f"""<figure class="g {('g--'+mod) if mod else ''}">
  <img src="{src}" alt="{cap}" loading="lazy">
  <figcaption>{cap}</figcaption>
</figure>"""

GALLERY = pageheader(
    "Gallery",
    "Pictures from <em>the field</em>.",
    "Selected photographs from our reserve, expeditions, and research sites across Mexico."
) + f"""
<section class="section wrap reveal">
  <div class="gallery">
    {''.join(gallery_tile(*g) for g in GALLERY_IMAGES)}
  </div>
</section>
"""


# ============================================================
# STORIES
# ============================================================

STORIES_LIST = [
    ("Extinct strength", "Essay · 2025",
     "What the bee orchid can tell us about the bumblebee that disappeared.",
     f"{IMG}/ophrys-apifera.png", "extinct-strength.html"),
    ("A new × Dinedema from the cloud forest", "Field report · 2025",
     "Notes on the discovery, description and publication of × Dinedema mariae — Orchidarc's first contribution to the taxonomic record of Mexican orchids.",
     f"{IMG}/dinedema-mariae.jpg",
     "https://www.researchgate.net/publication/393387931_A_new_nothogenus_and_a_new_nothospecies_in_the_subtribe_Laeliinae_Orchidaceae_from_Mexico"),
    ("Counting Cypripedium", "Conservation · 2024",
     "How we mapped the largest known Cypripedium population in Mesoamerica — and why the work is just beginning.",
     f"{IMG}/cypripedium-a.JPG", "cypripedium.html"),
    ("On the altars of Allsaints", "Film notes · 2025",
     "The making of Lily of Allsaints — a year in the cloud forest, the cemeteries, and the family histories of Veracruz.",
     f"{IMG}/anceps-day-of-the-dead-collection.jpg",
     "https://www.youtube.com/watch?v=9ozJdv3ggG0"),
]

def story_card(title, eyebrow, excerpt, img, href):
    return f"""<a class="story" href="{href}">
  <div class="story__img"><img src="{img}" alt="{title}" loading="lazy"></div>
  <div class="story__meta">{eyebrow}</div>
  <h3 class="story__title">{title}</h3>
  <p class="story__excerpt">{excerpt}</p>
  <span class="story__read">Read →</span>
</a>"""

STORIES = pageheader(
    "Stories & Field Notes",
    "From the <em>cloud forest</em>.",
    "Essays, field reports, and notes from our research and films. Updated occasionally."
) + f"""
<section class="section wrap reveal">
  <div class="stories">
    {''.join(story_card(*s) for s in STORIES_LIST)}
  </div>
</section>
"""


# ============================================================
# MEXICO TOURS
# ============================================================

MEXICO_TOURS = pageheader(
    "Mexico Orchid Expeditions",
    "Twelve days in the <em>cloud forest</em>.",
    "Small-group field expeditions led by working orchid biologists. Veracruz and Oaxaca, in the heart of the Mexican orchid season."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 32px">
    <img src="{IMG}/waterfall.jpg" alt="Cloud forest waterfall">
    <figcaption class="hero__caption">PL. 03 — Cloud forest waterfall, Veracruz</figcaption>
  </figure>
  <p style="text-align:center;margin-bottom:64px">
    <a class="btn" href="https://drive.google.com/file/d/1H7ckHHIqTYHGTRim2Nvwt1e4zlQQVHwc/view?usp=drive_link" target="_blank" rel="noopener">Download the full tour brochure (PDF)</a>
  </p>
</section>

<section class="section wrap reveal">
  <div class="tours-grid">
    <div>
      <h3 class="block__title">What this is</h3>
      <p>A working scientific expedition for orchid enthusiasts and naturalists. Not a luxury tour. We move between cloud forest, oak-pine and tropical sites in the company of biologists who know each location intimately. You see orchids in habitat — many of them species you cannot see anywhere else.</p>
      <p>Group size is capped at six participants. The pace is moderate, the days are long, and the rewards are substantial.</p>
    </div>
    <div>
      <h3 class="block__title">What's included</h3>
      <ul class="checklist">
        <li>11 nights' accommodation (mix of small hotels and our reserve guesthouse)</li>
        <li>All ground transport in private Sprinter van</li>
        <li>All meals in the field; mixed kitchen / restaurant structure</li>
        <li>Scientific guiding throughout</li>
        <li>Site permits and access fees</li>
      </ul>
    </div>
  </div>
</section>

<section class="section wrap reveal">
  <h3 class="section__title" style="margin-bottom:48px">Indicative itinerary <em>— July 2026</em></h3>
  <ol class="itinerary">
    <li><span class="day">Day 1</span><div><h4>Arrival · Puebla pickup</h4><p>Group meets in Puebla. Transfer to Xalapa, Veracruz.</p></div></li>
    <li><span class="day">Day 2–4</span><div><h4>Veracruz · Orchidarc Reserve</h4><p>Three days at our reserve in Ixhuacán de los Reyes. Field work, monitoring, and photography in primary cloud forest.</p></div></li>
    <li><span class="day">Day 5</span><div><h4>Tepetlán forest</h4><p>Day excursion to a remnant cloud forest site rich in <em>Encyclia</em> and <em>Prosthechea</em>.</p></div></li>
    <li><span class="day">Day 6–7</span><div><h4>Cofre de Perote</h4><p>High-elevation slipper orchid sites. <em>Cypripedium</em> in habitat.</p></div></li>
    <li><span class="day">Day 8</span><div><h4>Ciudad Mendoza</h4><p>Translocation between regions. Evening arrival in the Mixteca.</p></div></li>
    <li><span class="day">Day 9–10</span><div><h4>Oaxaca · Monte Verde &amp; Tejupan</h4><p>Two days in the high Mixteca, with terrestrial orchids in pine-oak forest.</p></div></li>
    <li><span class="day">Day 11</span><div><h4>Return to Puebla</h4><p>Long transfer day. Evening in Puebla.</p></div></li>
    <li><span class="day">Day 12</span><div><h4>Departure</h4><p>Morning departures from Puebla.</p></div></li>
  </ol>
</section>

<section class="section wrap reveal">
  <div class="tours-grid">
    <div>
      <h3 class="block__title">Pricing</h3>
      <p>Indicative range, USD <strong>$3,200–$3,500</strong> per participant — based on shared accommodation, twin occupancy. Single supplement available. Discounted rates for participants who can use accommodation only (no kitchen / restaurant package).</p>
      <p class="muted">A portion of every booking directly funds Orchidarc's conservation work in Mexico.</p>
    </div>
    <div>
      <h3 class="block__title">Enquire</h3>
      <p>Tours are arranged individually. To enquire about availability, group composition or a custom itinerary, write to <a href="mailto:andresr@orchidarc.org">andresr@orchidarc.org</a>.</p>
      <p style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn--filled" href="mailto:andresr@orchidarc.org?subject=Mexico%20Orchid%20Expedition%20enquiry">Send an enquiry</a>
        <a class="btn" href="https://drive.google.com/file/d/1H7ckHHIqTYHGTRim2Nvwt1e4zlQQVHwc/view?usp=drive_link" target="_blank" rel="noopener">Brochure (PDF)</a>
      </p>
    </div>
  </div>
</section>
"""


# ============================================================
# ABOUT — with Andrés portrait
# ============================================================

ABOUT = pageheader(
    "About",
    "Orchidarc is a small <em>conservation NGO</em> with three disciplines.",
    "Field biology, conservation practice, documentary cinema."
) + f"""
<section class="wrap reveal">
  <figure class="hero__frame" style="margin:32px 0 64px;aspect-ratio:16/9">
    <img src="{IMG}/andres-with-halbingeriana.jpg" alt="Andrés Ramos in the field with Laelia halbingeriana">
    <figcaption class="hero__caption">Director Andrés Ramos — fieldwork, Veracruz cloud forest</figcaption>
  </figure>
</section>

<section class="section wrap reveal">
  <div class="about">
    <div class="about__col">
      <p class="about__lede">We were registered with the UK Charity Commission in 2022 (no. <strong>1208062</strong>), with operations primarily in Mexico and field collaborations in the United Kingdom, Japan, Ecuador and Costa Rica.</p>
      <div class="about__stats">
        <div><div class="stat__num">≈1300</div><div class="stat__label">Orchid species in Mexico</div></div>
        <div><div class="stat__num">≈600</div><div class="stat__label">Endemic to Mexico</div></div>
        <div><div class="stat__num">14 ha</div><div class="stat__label">Cloud forest under management</div></div>
        <div><div class="stat__num">2022</div><div class="stat__label">Year founded</div></div>
      </div>
    </div>
    <div class="about__col">
      <p>Orchidarc emerged from a single observation: the most threatened orchid species in Mexico are not the rare ones. They are the everyday ones — the species that grow on the trees in your grandmother's churchyard, the orchids that adorn altars during the Day of the Dead, the species that everybody knows and nobody studies.</p>
      <p>Our work is to bring scientific rigour to these familiar species, to document and assess them properly, and to use the resulting science to support conservation that is led by the communities living alongside them.</p>
      <p>And we make documentary films — because the cloud forest is one of the most cinematic ecosystems on earth, and most of the world has never seen it.</p>
    </div>
  </div>
</section>

<section class="section wrap reveal">
  <h3 class="section__title" style="margin-bottom:48px">Three <em>pillars</em>.</h3>
  <div class="about__pillars about__pillars--full">
    <div class="pillar">
      <span class="pillar__num">01 — Research</span>
      <div>
        <h4>Field &amp; laboratory</h4>
        <p>Floristic survey work, taxonomic contributions, IUCN Red List assessment, biomaterials research on the orchid pollinarium adhesive, and the RAR Climate Replicator for habitat simulation. <a href="research.html">See the research →</a></p>
      </div>
    </div>
    <div class="pillar">
      <span class="pillar__num">02 — Conservation</span>
      <div>
        <h4>In-situ &amp; ex-situ</h4>
        <p>Reserve management at our cloud forest site in Veracruz, symbiotic propagation of threatened species, and reintroduction work with regional protected areas including La Martinica.</p>
      </div>
    </div>
    <div class="pillar">
      <span class="pillar__num">03 — Cinema</span>
      <div>
        <h4>Documentary as a tool</h4>
        <p>Long-form documentary filmmaking that treats orchids as protagonists rather than props — and brings the science, the people, and the landscapes back to international audiences and funders.</p>
      </div>
    </div>
  </div>
</section>

<section class="section wrap reveal">
  <h3 class="section__title" style="margin-bottom:48px">Affiliations &amp; recognition</h3>
  <div class="affiliations">
    <div><h5>IUCN SSC</h5><p>Member, Orchid Specialist Group. Trained regional and global Red List assessor.</p></div>
    <div><h5>University of Tokyo</h5><p>Doctoral research on orchid bioadhesives.</p></div>
    <div><h5>University of Sheffield</h5><p>Founding institutional link; ongoing biomaterials collaboration.</p></div>
    <div><h5>Universidad Veracruzana</h5><p>Mexican research partner.</p></div>
    <div><h5>FICAA Mexico City</h5><p>Best Feature Environmental Documentary, 2025 — <em>Lily of Allsaints</em>.</p></div>
    <div><h5>Conferences</h5><p>Encuentro Mexicano de Orquideología; World Orchid Conference; Andean Orchid Conference; Adhesion Society.</p></div>
  </div>
</section>
"""


# ============================================================
# TAKE ACTION, STORE, SOCIALS, FILMS, 404
# ============================================================

TAKE_ACTION = pageheader(
    "Take Action",
    "Three ways to <em>support</em> the work.",
    "Every contribution funds field work, monitoring, and the documentary projects that bring the cloud forest to a global audience."
) + f"""
<section class="section wrap reveal">
  <div class="actions-grid">
    <div class="bigcard">
      <span class="bigcard__num">01</span>
      <h3 class="bigcard__title">Donate</h3>
      <p>One-time or recurring contributions of any size. Your gift directly supports field expeditions, monitoring infrastructure, IUCN assessment work and our documentary slate.</p>
      <p><a class="btn btn--filled" href="https://www.paypal.com/donate/?hosted_button_id=ZPBGSJ42SECCA" target="_blank" rel="noopener">Donate via PayPal</a></p>
      <p class="muted" style="margin-top:14px">For UK or Mexico bank transfer details, write to <a href="mailto:andresr@orchidarc.org">andresr@orchidarc.org</a>.</p>
    </div>
    <div class="bigcard">
      <span class="bigcard__num">02</span>
      <h3 class="bigcard__title">Join an expedition</h3>
      <p>Spend twelve days with us in the cloud forests of Veracruz and Oaxaca. Small group, expert guidance, real field work. Each booking funds further conservation.</p>
      <p><a class="btn" href="mexico-tours.html">See itineraries</a></p>
    </div>
    <div class="bigcard">
      <span class="bigcard__num">03</span>
      <h3 class="bigcard__title">Wear the work</h3>
      <p>The Laelia collection — limited-run garments celebrating Mexico's most iconic orchid genus. All proceeds support the reserve.</p>
      <p><a class="btn" href="store.html">Visit the store</a></p>
    </div>
  </div>
</section>

<section class="section wrap reveal">
  <h3 class="section__title" style="margin-bottom:32px">Other ways to <em>help</em>.</h3>
  <div class="prose">
    <ul class="checklist">
      <li><b>Spread the films.</b> Share our documentaries — every view brings the cloud forest to a new audience.</li>
      <li><b>Volunteer.</b> Field-season volunteers with biology, photography, video or carpentry skills are welcome. Write to us.</li>
      <li><b>Partner.</b> If you represent an institution, foundation or NGO with overlapping mission, we'd like to hear from you.</li>
    </ul>
    <p style="margin-top:32px"><a class="btn btn--filled" href="mailto:andresr@orchidarc.org">Get in touch</a></p>
  </div>
</section>
"""


STORE = pageheader(
    "Store",
    "The <em>Laelia</em> collection.",
    "Genetic research has shown that the genus Laelia is largely endemic to Mexico. We celebrate one of the most iconic orchid genera in the country with a small collection of garments — all proceeds fund the reserve."
) + f"""
<section class="section wrap reveal">
  <figure class="hero__frame" style="aspect-ratio:16/9;margin-bottom:48px">
    <img src="{IMG}/laelia-collection.jpg" alt="The Laelia collection" style="object-position:center 30%">
    <figcaption class="hero__caption">The <b>Laelia</b> collection — limited run, 2025</figcaption>
  </figure>

  <div class="gallery" style="grid-auto-rows:340px;margin-bottom:48px">
    <figure class="g"><img src="{IMG}/laelia-collection-b.jpg" alt="Laelia collection"><figcaption>Detail</figcaption></figure>
    <figure class="g"><img src="{IMG}/laelia-collection-c.jpg" alt="Laelia collection"><figcaption>Styled</figcaption></figure>
    <figure class="g"><img src="{IMG}/anceps-day-of-the-dead-collection.jpg" alt="Laelia anceps"><figcaption>The inspiration — <em>Laelia anceps</em></figcaption></figure>
  </div>

  <div class="prose">
    <p class="prose__lede">A small, considered collection of garments printed with original botanical illustrations of Mexico's wild Laelia species. Limited print runs. Every sale funds field conservation in Veracruz.</p>
    <p class="muted">Online ordering is being moved to a new platform. To order in the meantime, or to enquire about wholesale for orchid societies and gardens, please write to <a href="mailto:andresr@orchidarc.org">andresr@orchidarc.org</a>.</p>
    <p style="margin-top:32px"><a class="btn btn--filled" href="mailto:andresr@orchidarc.org?subject=Laelia%20Collection%20order">Enquire about an order</a></p>
  </div>
</section>
"""


SOCIALS = pageheader(
    "Socials",
    "Where to find us <em>elsewhere</em>.",
    "All Orchidarc channels in one place."
) + """
<section class="section wrap reveal">
  <div class="socials-grid">
    <a class="soc" href="https://www.youtube.com/channel/UCTxs17CLsXiwm5GgsLcLMYQ" target="_blank" rel="noopener">
      <span class="soc__plat">YouTube</span>
      <h3 class="soc__handle">@orchidarc</h3>
      <p>Documentaries, field reports, behind-the-scenes from the cloud forest.</p>
      <span class="soc__go">Visit channel →</span>
    </a>
    <a class="soc" href="https://www.instagram.com/orchidarcngo/" target="_blank" rel="noopener">
      <span class="soc__plat">Instagram</span>
      <h3 class="soc__handle">@orchidarc</h3>
      <p>Photographs from the field, day-by-day during the season.</p>
      <span class="soc__go">Visit profile →</span>
    </a>
    <a class="soc" href="https://www.researchgate.net/profile/Andres-Ramos-Orchidarc" target="_blank" rel="noopener">
      <span class="soc__plat">ResearchGate</span>
      <h3 class="soc__handle">Andrés Ramos</h3>
      <p>Scientific publications, including the description of × Dinedema mariae.</p>
      <span class="soc__go">View publications →</span>
    </a>
    <a class="soc" href="mailto:andresr@orchidarc.org">
      <span class="soc__plat">Email</span>
      <h3 class="soc__handle">andresr@orchidarc.org</h3>
      <p>Direct contact for partnerships, press, and tour enquiries.</p>
      <span class="soc__go">Write to us →</span>
    </a>
  </div>
  <p class="muted" style="margin-top:48px;text-align:center">Follow us for ongoing updates from the field — and the next film release.</p>
</section>
"""


FILMS = pageheader(
    "Films",
    "Our <em>documentary</em> work.",
    "Released films and current development. Streaming is via YouTube; festival screening enquiries via email."
) + f"""
<section class="section wrap reveal">
  <div class="films">

    <article class="film">
      <a href="https://www.youtube.com/watch?v=9ozJdv3ggG0" target="_blank" rel="noopener" class="film__poster">
        <img src="{IMG}/film-lily-of-allsaints.jpg" alt="Lily of Allsaints">
        <div class="film__play"><span>▶</span></div>
      </a>
      <div class="film__meta"><span>2025 · 35 min · Documentary</span><span>EN / ES</span></div>
      <h3 class="film__title"><em>Lily of Allsaints</em></h3>
      <p class="film__desc">The sacred orchids of Mexico — <em>Laelia anceps</em> on the altars of the Day of the Dead, the cloud forests where it still grows wild, and the people who have woven it into a thousand years of ceremony.</p>
      <div class="film__lang">
        <a href="https://www.youtube.com/watch?v=9ozJdv3ggG0&t=1108s" target="_blank" rel="noopener">Watch (EN) ↗</a>
        <a href="https://www.youtube.com/watch?v=-iy_hTD1Fsc&t=1376s" target="_blank" rel="noopener">Ver (ES) ↗</a>
      </div>
      <span class="film__award">Best Feature Environmental Documentary, FICAA Mexico City, 2025</span>
    </article>

    <article class="film">
      <a href="https://www.youtube.com/watch?v=XlOR4z7b86s" target="_blank" rel="noopener" class="film__poster">
        <img src="{IMG}/film-spring-orchids.jpg" alt="Spring Orchids: Mexico">
        <div class="film__play"><span>▶</span></div>
      </a>
      <div class="film__meta"><span>2025 · 19 min · Short</span><span>EN / ES</span></div>
      <h3 class="film__title"><em>Spring Orchids: Mexico</em></h3>
      <p class="film__desc">Spring in Mexico is the warmest, driest season — and it brings forth unimaginable beauty. A montage-style portrait of the orchids that bloom when the forest is at its thirstiest.</p>
      <div class="film__lang"><a href="https://www.youtube.com/watch?v=XlOR4z7b86s" target="_blank" rel="noopener">Watch ↗</a></div>
    </article>

  </div>

  <div class="indev">
    <span class="indev__tag">In Development</span>
    <h3 class="indev__title"><em>Orchids of Mexico</em></h3>
    <p>A feature-length documentary in development with Orchidarc. Three interwoven scientific threads — the bioadhesive that holds pollination together, the mycorrhizal partnerships that build orchid life, and the floral deception that makes pollinators visit at all — set against the full geography of Mexican orchid habitat in Veracruz and Oaxaca.</p>
    <p class="muted">Enquiries from broadcasters, distributors and co-production partners welcome — <a href="mailto:andresr@orchidarc.org">andresr@orchidarc.org</a>.</p>
  </div>
</section>
"""


NOT_FOUND = """<section class="wrap" style="padding:160px 0 200px;text-align:center">
  <span class="ph__eyebrow">Error 404</span>
  <h1 class="ph__title" style="margin-top:24px"><em>This species</em> is not in the herbarium.</h1>
  <p style="margin:32px auto 40px;max-width:48ch;color:rgba(27,26,23,.7)">The page you were looking for may have moved, or it may never have existed. Try the herbarium index — or head back to the front page.</p>
  <p><a class="btn btn--filled" href="index.html">Back to the home page</a></p>
</section>
"""


# ============================================================
# WRITE FILES
# ============================================================

PAGES = [
    ("index.html",                  "Orchidarc — Saving the wild orchids of Mexico", "UK-registered conservation NGO (charity no. 1208062) protecting the wild orchids of Mexico through research, restoration and documentary film.", HOME_BODY,           ""),
    ("films.html",                  "Films — Orchidarc",                             "Documentary work from Orchidarc — Lily of Allsaints, Spring Orchids: Mexico, and Orchids of Mexico (in development).",                              FILMS,               "films"),
    ("research.html",               "Research — Orchidarc",                          "The RAR Climate Replicator and orchid bioadhesive research from Orchidarc.",                                                                          RESEARCH,            "research"),
    ("cypripedium.html",            "Cypripedium — Urgent Conservation · Orchidarc", "The largest known Cypripedium population in Mesoamerica. Our urgent conservation campaign in the Cofre de Perote cloud forest belt.",                CYPRIPEDIUM,         "species"),
    ("laelia-anceps.html",          "Laelia anceps — Orchidarc",                     "Species profile: Laelia anceps Lindl., Mexico's cultural orchid and the lily of the Day of the Dead.",                                                LAELIA_ANCEPS,       "species"),
    ("laelia-halbingeriana.html",   "Laelia halbingeriana — Orchidarc",              "Species profile: Laelia halbingeriana — a recently described endemic cloud-forest Laelia from Mexico's eastern Sierra Madre.",                        LAELIA_HALBINGERIANA,"species"),
    ("laelia-furfuracea.html",      "Laelia furfuracea — Orchidarc",                 "Species profile: Laelia furfuracea — Oaxaca's ceremonial Laelia, endemic and under special protection.",                                            LAELIA_FURFURACEA,   "species"),
    ("epidendrum-parkinsonianum.html","Epidendrum parkinsonianum — Orchidarc",       "Species profile: Epidendrum parkinsonianum — the pendant-leaf giant of Mexican cloud forest canopies.",                                              EPIDENDRUM,          "species"),
    ("acineta-barkeri.html",        "Acineta barkeri — Orchidarc",                   "Species profile: Acineta barkeri — endangered, fragrant, endemic to the cloud forests of Veracruz, Mexico. Under pressure from illegal trade.", ACINETA,             "species"),
    ("prosthechea-vitellina.html",  "Prosthechea vitellina — Orchidarc",             "Species profile: Prosthechea vitellina — endangered Central American orchid thriving on Orchidarc's reserve.",                                       PROSTHECHEA,         "species"),
    ("extinct-strength.html",       "Extinct strength — Orchidarc",                  "Essay: what the bee orchid can tell us about the bumblebee that disappeared.",                                                                        EXTINCT,             "research"),
    ("herbarium.html",              "Digital Herbarium — Orchidarc",                 "An ongoing index of orchid species documented and monitored by Orchidarc in the field.",                                                              HERBARIUM,           "species"),
    ("gallery.html",                "Gallery — Orchidarc",                           "Photographs from Orchidarc's reserve, expeditions and research sites across Mexico.",                                                                 GALLERY,             ""),
    ("stories.html",                "Stories & Field Notes — Orchidarc",             "Essays and field reports from Orchidarc's research and films.",                                                                                       STORIES,             "stories"),
    ("mexico-tours.html",           "Mexico Orchid Expeditions — Orchidarc",         "Small-group field expeditions in the cloud forests of Veracruz and Oaxaca, led by working orchid biologists.",                                       MEXICO_TOURS,        ""),
    ("about.html",                  "About — Orchidarc",                             "About Orchidarc — a UK-registered conservation NGO working at the intersection of field biology, conservation practice and documentary cinema.",      ABOUT,               "about"),
    ("take-action.html",            "Take Action — Orchidarc",                       "Donate, join an expedition, or visit the store — three ways to support Orchidarc's conservation work in Mexico.",                                       TAKE_ACTION,         ""),
    ("store.html",                  "Store — Orchidarc",                             "The Laelia collection — limited-run garments printed with original botanical illustrations. All proceeds support our reserve.",                       STORE,               "store"),
    ("socials.html",                "Socials — Orchidarc",                           "All Orchidarc channels in one place — YouTube, Instagram, ResearchGate and email.",                                                                  SOCIALS,             ""),
    ("404.html",                    "Not found — Orchidarc",                         "The page you're looking for could not be found.",                                                                                                     NOT_FOUND,           ""),
]

for filename, title, desc, body, active in PAGES:
    html = page(title, desc, body, active=active)
    (OUT / filename).write_text(html, encoding="utf-8")
    print(f"  → {filename}  ({len(html):,} bytes)")

print(f"\nWrote {len(PAGES)} pages to {OUT}")
