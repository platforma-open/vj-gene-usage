# @platforma-open/milaboratories.vj-usage

## 2.2.3

### Patch Changes

- 50ef10d: Add missing flag in prepublishOnly

## 2.2.2

### Patch Changes

- 5785e1b: Only offer single-cell chains that actually have columns. The chain selector was
  built from the receptor type alone, so on heavy-chain-only (VHH) single-cell input
  it still offered "Light" — picking it failed the workflow with `expected exactly 1
V gene column for chain, got 0`. A new `availableScChains` model output reports the
  chains present for the selected dataset; the selector now lists only those (and is
  hidden when a single chain leaves nothing to choose).
- Updated dependencies [5785e1b]
  - @platforma-open/milaboratories.vj-usage.model@2.2.1
  - @platforma-open/milaboratories.vj-usage.ui@2.3.2

## 2.2.1

### Patch Changes

- 970dad5: Fix stale graph data-mapping when switching datasets. graph-maker 1.1.222 gated
  its default re-resolution behind a `data-state-key` change, so switching the
  dataset left the previous dataset's columns in the chart as "Inconsistent value"
  with no graph. Bump graph-maker to 1.4.6 (same version other blocks on this SDK
  line use), which re-resolves defaults automatically when the pframe changes.
- Updated dependencies [970dad5]
  - @platforma-open/milaboratories.vj-usage.ui@2.3.1

## 2.2.0

### Minor Changes

- 135171f: Migrate onto the block-tools structurer (full SDK upgrade: model/ui-vue 1.79.14,
  workflow-tengo 6.6.3, tengo-builder 4.0.8) and BlockModelV3.

  Persisted state is preserved via the legacy upgrader. UI bindings move to
  `app.model.data`. The three plot view states, `weightedFlag`, and the derived
  block label are now UI-only and no longer stale the block; only the dataset,
  allele/gene toggle, single-cell chain, and custom block label do. Graphs remain
  the standard `<GraphMaker>` component.

### Patch Changes

- Updated dependencies [135171f]
  - @platforma-open/milaboratories.vj-usage.model@2.2.0
  - @platforma-open/milaboratories.vj-usage.ui@2.3.0
  - @platforma-open/milaboratories.vj-usage.workflow@2.4.5

## 2.1.19

### Patch Changes

- Updated dependencies [ece9ae6]
  - @platforma-open/milaboratories.vj-usage.ui@2.2.1
  - @platforma-open/milaboratories.vj-usage.model@2.1.7

## 2.1.18

### Patch Changes

- Updated dependencies [189b73a]
  - @platforma-open/milaboratories.vj-usage.ui@2.2.0

## 2.1.17

### Patch Changes

- f944d8c: SDK update
- Updated dependencies [a7b6c3c]
  - @platforma-open/milaboratories.vj-usage.model@2.1.6
  - @platforma-open/milaboratories.vj-usage.ui@2.1.11

## 2.1.16

### Patch Changes

- Updated dependencies [8d6c7ba]
  - @platforma-open/milaboratories.vj-usage.ui@2.1.10

## 2.1.15

### Patch Changes

- Updated dependencies [4bd5061]
  - @platforma-open/milaboratories.vj-usage.ui@2.1.9

## 2.1.14

### Patch Changes

- Updated dependencies [0101c6b]
  - @platforma-open/milaboratories.vj-usage.ui@2.1.8

## 2.1.13

### Patch Changes

- f2f0821: Show running state for tables and graphs
- Updated dependencies [f2f0821]
  - @platforma-open/milaboratories.vj-usage.workflow@2.4.4
  - @platforma-open/milaboratories.vj-usage.model@2.1.5
  - @platforma-open/milaboratories.vj-usage.ui@2.1.7

## 2.1.12

### Patch Changes

- 81536ef: technical release
- Updated dependencies [81536ef]
  - @platforma-open/milaboratories.vj-usage.model@2.1.4
  - @platforma-open/milaboratories.vj-usage.ui@2.1.6
  - @platforma-open/milaboratories.vj-usage.workflow@2.4.3

## 2.1.11

### Patch Changes

- 75f706a: Block metadata updated

## 2.1.10

### Patch Changes

- e5cf752: Update SDK

## 2.1.9

### Patch Changes

- Updated dependencies [81799c7]
  - @platforma-open/milaboratories.vj-usage.ui@2.1.5

## 2.1.8

### Patch Changes

- Updated dependencies [dca6a16]
  - @platforma-open/milaboratories.vj-usage.workflow@2.4.2

## 2.1.7

### Patch Changes

- 9a745e8: technical release
- 83edfdf: technical release
- 59cda2d: technical release
- 3385764: technical release
- Updated dependencies [9a745e8]
- Updated dependencies [83edfdf]
- Updated dependencies [59cda2d]
- Updated dependencies [3385764]
  - @platforma-open/milaboratories.vj-usage.model@2.1.3
  - @platforma-open/milaboratories.vj-usage.ui@2.1.4
  - @platforma-open/milaboratories.vj-usage.workflow@2.4.1

## 2.1.6

### Patch Changes

- Updated dependencies [8498650]
  - @platforma-open/milaboratories.vj-usage.model@2.1.2
  - @platforma-open/milaboratories.vj-usage.ui@2.1.3

## 2.1.5

### Patch Changes

- Updated dependencies [9932fd6]
  - @platforma-open/milaboratories.vj-usage.workflow@2.4.0

## 2.1.4

### Patch Changes

- 6d03a5c: Updated SDK.
- Updated dependencies [6d03a5c]
  - @platforma-open/milaboratories.vj-usage.model@2.1.1
  - @platforma-open/milaboratories.vj-usage.ui@2.1.2
  - @platforma-open/milaboratories.vj-usage.workflow@2.3.1

## 2.1.3

### Patch Changes

- Updated dependencies [aecedce]
  - @platforma-open/milaboratories.vj-usage.ui@2.1.1

## 2.1.2

### Patch Changes

- Updated dependencies [ad82619]
  - @platforma-open/milaboratories.vj-usage.workflow@2.3.0

## 2.1.1

### Patch Changes

- cddbb4a: Update SDK and add mem cpu requests
- Updated dependencies [cddbb4a]
  - @platforma-open/milaboratories.vj-usage.workflow@2.2.1

## 2.1.0

### Minor Changes

- 2e659c6: allow prepare venv on Windows

## 2.0.7

### Patch Changes

- Updated dependencies [8d95c4b]
  - @platforma-open/milaboratories.vj-usage.workflow@2.2.0
  - @platforma-open/milaboratories.vj-usage.model@2.1.0
  - @platforma-open/milaboratories.vj-usage.ui@2.1.0

## 2.0.6

### Patch Changes

- Updated dependencies [c674b70]
  - @platforma-open/milaboratories.vj-usage.workflow@2.1.0

## 2.0.5

### Patch Changes

- Updated dependencies [85529c8]
  - @platforma-open/milaboratories.vj-usage.workflow@2.0.2

## 2.0.4

### Patch Changes

- 12fcf9d: Updated block metadata

## 2.0.3

### Patch Changes

- db48e22: Init
- Updated dependencies [db48e22]
  - @platforma-open/milaboratories.vj-usage.model@2.0.1
  - @platforma-open/milaboratories.vj-usage.ui@2.0.1
  - @platforma-open/milaboratories.vj-usage.workflow@2.0.1
