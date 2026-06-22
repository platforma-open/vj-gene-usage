---
"@platforma-open/milaboratories.vj-usage.model": minor
"@platforma-open/milaboratories.vj-usage.ui": minor
"@platforma-open/milaboratories.vj-usage.workflow": patch
"@platforma-open/milaboratories.vj-usage": minor
---

Migrate onto the block-tools structurer (full SDK upgrade: model/ui-vue 1.79.14,
workflow-tengo 6.6.3, tengo-builder 4.0.8) and BlockModelV3.

Persisted state is preserved via the legacy upgrader. UI bindings move to
`app.model.data`. The three plot view states, `weightedFlag`, and the derived
block label are now UI-only and no longer stale the block; only the dataset,
allele/gene toggle, single-cell chain, and custom block label do. Graphs remain
the standard `<GraphMaker>` component.
