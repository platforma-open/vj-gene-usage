# @platforma-open/milaboratories.vj-usage.kind

## 1.1.1

### Patch Changes

- 4ce7e60: Bump the kind version. A comment in the kind source changed without a version bump. The registry keeps a published kind version immutable by source hash, so republishing 1.1.0 with different content failed and blocked the block release.

## 1.1.0

### Minor Changes

- b504391: Update the SDK and accept a subset filter (e.g. a Repertoire Labeling label or Lead Selection picks) with the input dataset. The dataset list is built with buildDatasetOptions (requireEnrichments: false). The subset restricts the clonotypes before usage is computed, so per-sample fractions are relative to the subset. Outputs of a subset run carry pl7.app/inputSubset in their domain and a trace rooted in the subset, so their labels name it; the default subtitle names the subset too. Unfiltered runs are unchanged.
