---
'@platforma-open/milaboratories.vj-usage.ui': minor
'@platforma-open/milaboratories.vj-usage': minor
---

Fix single-cell TCR chain selector mapping: A/B were swapped for TCRAB and TCRGD. Producers (mixcr-clonotyping, import-vdj-data) assign A to the more diverse chains: Beta and Delta. The selector was running usage on the opposite chain from the one labelled. Existing blocks are relabelled only, the stored chain value is unchanged, so nothing re-runs.

The selector also lists chains in the classic annotation order again — Alpha/Beta and Gamma/Delta — instead of the value order A/B.
