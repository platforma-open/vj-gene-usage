# V/J Gene Usage

Measure which germline gene segments your repertoire uses. This Platforma block calculates V and J gene segment usage frequencies across samples, plus their pairwise combinations, revealing the germline biases that antigen exposure, vaccination, and disease leave behind.

Open-source analysis block for Platforma, the biologics discovery platform by MiLaboratories. For the full no-code workflow, see [platforma.bio](https://platforma.bio/).

## What it does

Repertoires are not uniform draws from the germline. Some V and J segments are used far more than others at baseline, and that baseline shifts under selection: a response to a specific antigen frequently shows up as an over-representation of particular V genes, and comparing usage between conditions is one of the standard ways to detect that a repertoire has been shaped by something.

The block aggregates clonotype abundances by gene segment to produce usage frequencies per sample — for individual V genes, individual J genes, and V–J combinations. Results can be grouped by a sample metadata column, so usage is compared across the axis that matters for your study rather than sample by sample.

Three views correspond to the three questions. V gene usage and J gene usage are presented as bar plots for comparing individual segments across samples or groups; V/J combinations are presented as a heatmap, where pairing biases that neither marginal distribution shows become visible.

## Inputs & outputs

* **Input:** a clonotype dataset with V and J gene assignments and per-sample abundances, from any Platforma clonotyping or import block. Optionally a sample metadata column to group by.
* **Output:** V gene, J gene, and V–J combination usage frequencies per sample, as bar plots and a heatmap, with the underlying values available as columns.

## Specifications

| | |
|---|---|
| Block title in app | V/J Gene Usage |
| Metrics | Per-sample usage frequency for individual V genes, individual J genes, and V–J combinations |
| Calculation | Aggregation of clonotype abundances by gene segment |
| Grouping | Optional sample metadata column |
| Views | V gene usage bar plot, J gene usage bar plot, V/J combination heatmap |
| Modalities | TCR and BCR repertoires |

## Use cases

* **Antigen-driven bias:** detect over-representation of particular V genes following immunization or infection.
* **Condition comparison:** compare germline usage between treatment arms, timepoints, or disease and healthy cohorts.
* **Vaccine response:** identify the gene segments enriched in a vaccine-responding repertoire.
* **Pairing bias:** use the V/J heatmap to find combinations used more or less than their marginal frequencies predict.
* **Library QC:** check that a synthetic or amplified library covers the germline segments it was designed to.
* **Primer bias detection:** spot segments systematically under-represented because of amplification rather than biology.
* **Cross-cohort comparison:** compare usage profiles against published repertoire studies.

## FAQ

### What does gene usage tell me?

Which germline V and J segments the repertoire draws on, and in what proportion. Because usage shifts under antigen-driven selection, differences between conditions are evidence that something shaped the repertoire — one of the most established repertoire-level readouts.

### Why look at V–J combinations as well as individual genes?

Because pairing carries information the marginals do not. Two samples can have identical V and J usage separately while differing in which V pairs with which J. The heatmap surfaces those combination-level biases.

### How is usage calculated?

By aggregating clonotype abundances for each gene segment within each sample, so usage is weighted by how abundant the clonotypes using that segment are — not just by how many distinct clonotypes carry it.

### Can I compare across sample groups?

Yes. Set a metadata column as the grouping and usage is compared across those groups — condition, timepoint, donor, or whatever your study design uses.

### Does it work for both TCR and BCR?

Yes. Any repertoire with V and J gene assignments works, T-cell or B-cell.

### Could a usage bias be technical rather than biological?

Yes, and it is worth ruling out. Primer design and amplification can systematically under-represent segments. A bias that appears identically across all your samples, including controls, is more likely technical than biological.

## Documentation

Step-by-step guide: [Gene Usage](https://docs.platforma.bio/guides/vdj-analysis/gene-usage/)

## Part of the Platforma ecosystem

This block is part of [Platforma](https://platforma.bio/) by [MiLaboratories](https://github.com/milaboratory). Explore the other open-source blocks at [github.com/platforma-open](https://github.com/platforma-open) and the docs for V(D)J analysis at [docs.platforma.bio/biology-guides/vdj-analysis](https://docs.platforma.bio/biology-guides/vdj-analysis/).
