# Orchid maternity research page

The source for `eleutherocytes.html` is the author's **BJLS_submission_package_v2_2026-10-16**, superseding the 13 October package. Read files: final main manuscript, title page, supporting information, accession image inventory, cover letter, metadata, and README. The v2 README explicitly says nothing had been submitted; the website therefore states **manuscript in preparation**. Do not infer submission or acceptance from the existence of a submission package. No final Zenodo DOI was supplied; omit the placeholder DOI.

## Sources and implementation

- Main Tables 1 and 2 plus Supporting Table S1 supply the atlas. `atlas.json` preserves the derived public genus summaries; the same data are embedded in the page for a network-independent interactive explorer.
- The paper uses 20 genera under its stated genus concepts, 25 epidendroid accessions, 355 epidendroid stills, plus Sarcoglottis and Vanilla with nine stills each: 27 accessions and 373 stills overall. Eleven recordings come from Sobralia (7) and Coelogyne (4). Fields and recordings are not independent biological replicates.
- Six microscopy plates are browser-compatible, uniformly resized JPEG copies of the supplied TIFF figures. No experimental content, panel labels, contrast or annotations were changed during web preparation. The separate Cochleanthes hero uses the matching author-supplied source field from `Stigma JBL/Final figures and videos`.
- Figures 4 and 6 retain their supplied black margins in the downloadable image; the on-page viewport clips only the empty right-hand canvas. The source plates contain overlaid scale annotations; no new cell dimensions are inferred from the web copies.
- `eleutherocytes.css` extends the shared Orchidarc and stigma research styles. `eleutherocytes.js` progressively enhances the static atlas, plate gallery, and three-stage hypothesis explanation. All genus summaries and all plates remain available without JavaScript.
- Research overview index/card/publication and the companion stigma page link to the new page. Preserve the companion ACS status and its existing evidence qualifications.

## Scientific constraints

An eleutherocyte is a bounded, detached, non-pollen cellular profile under a morphological definition. Bright-field appearance does not establish organelle identity, tissue origin or viability. All eleven recordings document intracellular movement; viability was not directly assayed in this survey.

Observed pollen tubes in C. pulverula at 48 h are supported by a filament traced to a tetrad. C. lawrenceana filament identity is inferred from form and treatment. C. Burfordiense at 24 h has tube-like profiles; C. pulverula at 24 h has no filament traceable to tetrads. Different flowers supplied different times. Each treatment/time has one flower, with no bagging or recorded flower age. Avoid claiming a replicated time course, demonstrated guidance, fertilisation success or compatibility outcome.

Mormodes has one before/after observation: a dry stigma at first examination and composite present 48 h after pollinarium removal. An untreated control is required to attribute acceleration to removal.

Sarcoglottis is a male-phase orchidoid comparison with eleutherocyte-like cells, not an established homologous epidendroid state. Vanilla is unscorable, not absent. Paphiopedilum/Phragmipedium extraction failures are procedural, not histological absence records. Warreopsis species identification for JBL 47782 is pending; the source plate label is retained but the website qualifies it. Sobralia includes only S. macrantha and S. turrialbina.

The accessory-organ interpretation, early-origin/predominance proposal, nourishment, guidance, recognition, and tri-individual stigma scenario are proposals or hypotheses. Companion rheology and withdrawal experiments are separate datasets. The third-plant scenario is A (pollen donor), B (earlier stigma contributing carried cells), C (recipient stigma). Natural transfer, DNA release and exposure remain to be tested; none demonstrates DNA integration, lateral gene transfer or inheritance.

Keep all six authors in the order given on the 16 October title page. Use the latest author-confirmed status to update the manuscript entry and DOI when available. The live source is `AndresRamosHito/SITE`, main, deployed by Cloudflare Pages. Continue the existing repository and public site.
