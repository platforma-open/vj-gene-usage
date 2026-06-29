---
"@platforma-open/milaboratories.vj-usage.ui": patch
"@platforma-open/milaboratories.vj-usage": patch
---

Fix stale graph data-mapping when switching datasets. graph-maker 1.1.222 gated
its default re-resolution behind a `data-state-key` change, so switching the
dataset left the previous dataset's columns in the chart as "Inconsistent value"
with no graph. Bump graph-maker to 1.4.6 (same version other blocks on this SDK
line use), which re-resolves defaults automatically when the pframe changes.
