---
'@platforma-open/milaboratories.vj-usage.ui': minor
'@platforma-open/milaboratories.vj-usage': minor
---

Fix single-cell TCR chain selector mapping: A/B were swapped for TCRAB and TCRGD. Producers (mixcr-clonotyping, import-vdj-data) assign A to the more diverse chains: Beta and Delta. The selector was running usage on the opposite chain from the one labelled. Existing blocks are relabelled only, with the stored chain value is unchanged, so nothing re-runs.
