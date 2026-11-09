---
"@platforma-open/milaboratories.vj-usage.model": patch
"@platforma-open/milaboratories.vj-usage.ui": patch
---

Compute the block subtitle without opening the block

The subtitle shows the dataset's label, written when the user picks a dataset, followed
by "Allele" or "Gene", computed from the block's settings. It no longer depends on opening
the block, and opening the block no longer rewrites it. Existing blocks show "Allele" or
"Gene" alone until the dataset is picked again.
