---
"@platforma-open/milaboratories.vj-usage.model": patch
"@platforma-open/milaboratories.vj-usage.ui": patch
"@platforma-open/milaboratories.vj-usage": patch
---

Only offer single-cell chains that actually have columns. The chain selector was
built from the receptor type alone, so on heavy-chain-only (VHH) single-cell input
it still offered "Light" — picking it failed the workflow with `expected exactly 1
V gene column for chain, got 0`. A new `availableScChains` model output reports the
chains present for the selected dataset; the selector now lists only those (and is
hidden when a single chain leaves nothing to choose).
