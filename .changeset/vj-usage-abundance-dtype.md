---
'@platforma-open/milaboratories.vj-usage.workflow': patch
'@platforma-open/milaboratories.vj-usage': patch
---

Fix "division with 'String' datatypes is not allowed" when a dataset produces no
numeric abundance rows.

The input table was built with `tsvFileBuilder.build()`, which emits an untyped
TSV, so ptabler let polars infer the column types. An `abundance` column with no
parseable numeric value in the exported table — an empty join result, or all-null
abundance — is inferred as `String`, and the per-sample normalisation then failed
during query planning.

The table is now built with `buildForPT()`, so column types come from the
p-column and axis specs instead of inference. This also bumps
`@platforma-sdk/block-tools` to 2.14.3 to satisfy the CI publication gate.
