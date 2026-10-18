# Cattleya research website update — 18 October 2026

This directory records the sources and editorial decisions behind the Cattleya programme page, the Research overview, and the homepage research teasers. Manuscript files were read without modification.

## Source package

User-specified folder: `Cattleya_Cymbidium witthdrawal/BJLS_Orchidaceae_Special_Issue_Submission_WORD_FIGURES`.

The submitted title page and manuscript establish the title, authors, experiment and intended journal. The newer `REVISION_FIX_SOURCE_2026-10-08` package supplies the corrected interpretation and figures, particularly `00_READ_ME_FIRST.md`, `REVISION_FIX_SOURCE.md`, `numbers_ledger.csv`, `tables/retention_by_rate.csv`, `tables/caudicle_release_summary.csv`, and the clean-trial peak/event timing table. The October eleutherocyte cover letter independently describes the companion Cattleya manuscript as under consideration at BJLS. No acceptance or exact submission date is claimed.

The website explicitly distinguishes the submitted manuscript from the October reanalysis and proposed corrected figures. It does not imply that revision proposals have already been adopted in a published article.

## Published assets

| Website asset | Source |
| --- | --- |
| `images/cattleya-2026/failure-pathways.jpg` | Recommended R0 set, alternative clean-trial Figure 2; routine JPEG conversion at native dimensions, with all panels and labels retained |
| `images/cattleya-2026/force-events.png` | Recommended R0 set, alternative event-locked Figure 3 |
| `images/cattleya-2026/all-trials.png` | Recommended R0 set, corrected Figure 4 |
| `research/cattleya/retention.json` | The first two cohorts in the supplied retention table, with numeric conversion only |

No generated scientific imagery or reconstructed data plots are used. The interactive retention chart displays exact source counts. Static tables remain available without JavaScript. Other overview/homepage figures were already in the site repository.

## Scientific decisions

- Low-rate clean trials (10, 30, 50 mm/min): cohesive failure, 0/12 retained. High-rate clean trials (100, 150): junction release, 7/8 retained. This corrects the previous page's reversed deposition interpretation.
- All valid full-pollinarium trials: 4/20 retained at rates ≤50; 0/4 at 75; 19/40 at ≥100. There are 16 such trials. The 20-test total also includes two invalid adhesive/preload failures and two single-caudicle pulls.
- The five clean trials were selected partly by the observed pathway. Their association cannot be generalized to an all-or-none switch across all contacts.
- The 50–100 mm/min interval is an observed bracket, not a species-wide threshold or an animal speed. Crosshead rate is the controlled apparatus setting.
- Initial engagement peaks and later events are separate quantities. First junction-release system forces are 0.0954 and 0.1156 N. No fixed 0.25 N breaking force, fitted constitutive law, or rate independence is asserted.
- Figure values use the recommended R0 baseline (final ten-sample mean subtraction, clamping at zero). R1 remains a sensitivity analysis. Trial 15 is explicitly flagged.
- These are mechanical trials, not plant-level biological replicates. Genet/age unknown; sequential reuse, initial slip in trial 09, and stills-only evidence for trial 01 are disclosed.
- Apparent modulus/strain are geometry-dependent system estimates. Unresolved Cymbidium control identities do not support a rostellum inference on this page. Obsolete cross-genus validation claims were removed.
- Cattleya rostellar adhesive is called a viscarium. The obsolete archive DOI from the submitted metadata was omitted. The newer source-listed concept DOI could not be independently resolved during this update; no claim is made that a staged version-2 deposit is publicly available.

## Overview and homepage

The Research overview now has six figure-led entries and short introductions, retaining links to paternity's visual story, the Climate Replicator and the 2025 Phytotaxa paper. Status wording is conservative: submitted for BJLS and ACS JPCB; eleutherocytes in preparation; adhesives under revision; paternity described by evidence type without asserting a new journal status. The homepage adds three short entries linking to the latest studies. Existing homepage sections remain intact.

The CSS is scoped to these pages/components and includes narrow-screen layouts, visible keyboard focus and reduced-motion support. Experimental figures link to their full resolution. Programme data, static references and interactive states are validated before publishing. Browser-based visual QA was unavailable in the execution environment; the successful Cloudflare build is checked separately.
