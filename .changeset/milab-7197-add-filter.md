---
"@platforma-open/milaboratories.vj-usage": minor
"@platforma-open/milaboratories.vj-usage.kind": minor
"@platforma-open/milaboratories.vj-usage.model": minor
"@platforma-open/milaboratories.vj-usage.ui": minor
"@platforma-open/milaboratories.vj-usage.workflow": minor
---

Update the SDK and accept a subset filter (e.g. a Repertoire Labeling label or Lead Selection picks) with the input dataset. The dataset list is built with buildDatasetOptions (requireEnrichments: false). The subset restricts the clonotypes before usage is computed, so per-sample fractions are relative to the subset. Outputs of a subset run carry pl7.app/inputSubset in their domain and a trace rooted in the subset, so their labels name it; the default subtitle names the subset too. Unfiltered runs are unchanged.
