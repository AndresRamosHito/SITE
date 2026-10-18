# Stigmatic matrix research page

Updated 13 October 2026 for the submitted ACS manuscript **Cell-Laden Orchid Stigmatic Matrices Span a Continuum of Power-Law Viscoelasticity**, submitted to *The Journal of Physical Chemistry B*.

## Authoritative source

The author's local submission package was `Soft_Matter_Stigma/ACS Re/JPCB_submission_2026-10-13`. The final files read were `Manuscript_JPCB_Stigma_Ramos.docx` (modified 13 October, 19:21) and `Supporting_Information_Stigma_Ramos.docx` (19:04), rather than the v7 copies. Although the folder checklist refers to v8 filenames, those filenames were absent; the final unversioned manuscript contained all five supplied PNGs byte-for-byte (SHA-256 verified). The author confirmed submission to ACS. Do not infer acceptance, completed peer review, a journal DOI, or a public data deposit.

## Pages and assets

- `stigmatic-composite.html`: complete research story, study scope, measured results, pool-level comparison, figures, limits, and manuscript metadata.
- `stigma-research.css`: styles scoped to this page, retaining the shared Orchidarc header/footer and forest/paper branding.
- `stigma-research.js`: progressive enhancement for the genus comparison; underlying measurements remain available in the HTML table without JavaScript.
- `images/stigma-jpcb-2026/`: exact submitted Figures 1–4 and TOC graphic. Experimental images have not been altered. Original resolution is accessible from each figure.
- `research.html`: programme card, research index, methods, and publication entry updated.
- `orchid-adhesives.html` and `pollination-mechanics.html`: companion-study references aligned to the ACS study.

## Scientific constraints

Rheology has nine independently collected pools from five genera, but eight analysed frequency spectra. Dendrobium S2 has no analysed frequency spectrum. Laelia has one pool. Cymbidium S1 and S2 are different hybrids. Its S1 frequency sweep is above the 5% linear strain limit, so S2 is the primary spectrum.

Plateau storage modulus is measured in amplitude sweeps at 10 rad/s. Do not mix these values with G′ at 1 rad/s from frequency sweeps, or with adhesion force. Effective n′ and n″ exponents refer to the 1–100 rad/s common fitting window. A crossover has G′ = G″; nominal time is 1/ωc, not the period 2π/ωc or a single/longest relaxation time. Unobserved crossovers are bounds, not zero-frequency values or observed points. Cattleya S1 is bounded at 0.01 rad/s, S2 at 0.005. Dendrobium S1 extends to 0.026 rad/s, not 0.005.

The linear strain limit is a 5% reduction of plateau G′, distinct from the amplitude-sweep flow strain at G′ = G″. Creep at 5–20 Pa lies below the critical stress; incomplete recovery is not proof of yielding. Cattleya and Laelia recovery cannot be quantified reliably. Only first-heating data support thermal softening; heating to 50 °C irreversibly changes the material. Time–temperature superposition was not tested.

Projected cellular area is not a volume fraction. Phalaenopsis 90 ± 4% is an overlap-limited upper bound; a separate-session field gave 43%. Cell dimensions are retained only from verified selections: Oncidium 8, Laelia 6, Dendrobium 6, one field each. No shape–rheology correlation is justified by only two rheology genera. Cell viability and mechanical reinforcement were not directly tested. Microscopy and gravimetry are not measurements on the rheology pools; comparisons are at genus level.

The structure–rheology association is descriptive: |ρ| = 0.6 with five genera, exact p = 0.35, sensitivity |ρ| = 0.8. It does not prove cellular causation. Association lifetime and crowding are hypotheses; depletion/reconstitution at fixed matrix with sham controls is a discriminating experiment. No direct adhesion force or genus-specific pollinator adaptation is established by bulk oscillation. Predictions over hours or weeks extend beyond the measured window. Composition/SEM/TGA use separate Ecuadorian hybrid material, and dried SEM is not native hydrated architecture.

## Maintenance

Keep the manuscript title, author order, date, and status consistent across the overview and programme page. Update only from a newer author-supplied manuscript or confirmed journal record. Do not reintroduce the older Dahlquist-based argument, incorrect micrograph scale bars, unrestricted aspect-ratio values, genus values assembled from different pools, or claims of nonlinear creep. Preserve other research programmes and website navigation. This static website is deployed by the Cloudflare Pages integration on `AndresRamosHito/SITE`, branch `main`; the older `AndresRamosHito/Orchidarc` repository is not the active source.
