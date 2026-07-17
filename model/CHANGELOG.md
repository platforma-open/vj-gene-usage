# @platforma-open/milaboratories.vj-usage.model

## 2.2.1

### Patch Changes

- 5785e1b: Only offer single-cell chains that actually have columns. The chain selector was
  built from the receptor type alone, so on heavy-chain-only (VHH) single-cell input
  it still offered "Light" — picking it failed the workflow with `expected exactly 1
V gene column for chain, got 0`. A new `availableScChains` model output reports the
  chains present for the selected dataset; the selector now lists only those (and is
  hidden when a single chain leaves nothing to choose).

## 2.2.0

### Minor Changes

- 135171f: Migrate onto the block-tools structurer (full SDK upgrade: model/ui-vue 1.79.14,
  workflow-tengo 6.6.3, tengo-builder 4.0.8) and BlockModelV3.

  Persisted state is preserved via the legacy upgrader. UI bindings move to
  `app.model.data`. The three plot view states, `weightedFlag`, and the derived
  block label are now UI-only and no longer stale the block; only the dataset,
  allele/gene toggle, single-cell chain, and custom block label do. Graphs remain
  the standard `<GraphMaker>` component.

## 2.1.7

### Patch Changes

- ece9ae6: update dependencies

## 2.1.6

### Patch Changes

- a7b6c3c: Improve block subtitle generation, automatically open/close settings tab

## 2.1.5

### Patch Changes

- f2f0821: Show running state for tables and graphs

## 2.1.4

### Patch Changes

- 81536ef: technical release

## 2.1.3

### Patch Changes

- 9a745e8: technical release
- 83edfdf: technical release
- 59cda2d: technical release
- 3385764: technical release

## 2.1.2

### Patch Changes

- 8498650: Full SDK and python update

## 2.1.1

### Patch Changes

- 6d03a5c: Updated SDK.

## 2.1.0

### Minor Changes

- 8d95c4b: Refactor to use anchored queries

## 2.0.1

### Patch Changes

- db48e22: Init

## 2.0.0

### Major Changes

- 619231e: Block v2

## 1.1.0

### Minor Changes

- 1d45e7d: Added table and bar plot
