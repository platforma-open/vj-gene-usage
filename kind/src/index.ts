import { assertParamsObject, defineBlockKind } from "@platforma-sdk/block-kind";
import type { PlRef } from "@platforma-sdk/model";
import { isPlRef } from "@platforma-sdk/model";
import { name, version } from "../package.json" with { type: "json" };

/**
 * Which chain of a paired single-cell dataset the usage is counted over. The two
 * letters are positional rather than named: "A" is heavy/alpha/gamma and "B" is
 * light/beta/delta, and which words the user sees depends on the dataset's receptor.
 */
export type ScChain = "A" | "B";

/**
 * This block's init-params contract — everything a user sets by hand: the dataset
 * to profile, the chain to read on single-cell data, whether usage is counted per
 * allele or per gene, whether the plots weight each clonotype by its abundance,
 * and the subtitle they type.
 *
 * `defaultBlockLabel` is absent: a `watchEffect` in `ui/src/app.ts` builds it from
 * the dataset's option label and the chain's option label, neither of which exists
 * before the result pool has resolved the chosen dataset.
 *
 * The three plot states are absent too. They are graph-maker's own view state —
 * axis picks, clustering, which tab is open — written by the plotting component
 * rather than by the scientist, and a template that pinned them would be pinning a
 * camera position rather than an analysis.
 *
 * Every field is optional. A block with no dataset picked is the state a fresh
 * block is in, and it stays that way until the user chooses one; the projection
 * hands that state back untouched, so a required field would break the
 * export/apply round trip.
 */
export type BlockParams = {
  datasetRef?: PlRef;
  scChain?: ScChain;
  allele?: boolean;
  weightedFlag?: boolean;
  customBlockLabel?: string;
};

// Identity (`name`/`version`) comes from this package's own `package.json`, so
// the on-wire `{name}@{version}` reference can never drift from what npm
// publishes; the bundler inlines the JSON import.
export const kind = defineBlockKind<BlockParams>({
  name,
  version,
  parseInitializationParams,
});

// Internals

const SC_CHAINS: readonly string[] = ["A", "B"];

/** The same contract at runtime, for params arriving from a template file rather than typed code. */
function parseInitializationParams(value: unknown): BlockParams {
  assertParamsObject(value);

  const { datasetRef, scChain, allele, weightedFlag, customBlockLabel } = value;

  if (datasetRef !== undefined && !isPlRef(datasetRef)) {
    throw new Error(
      "'datasetRef' must be a reference to an upstream dataset, written as { block, name }.",
    );
  }
  // Checked as an envelope, not against the dataset: whether a chain letter means
  // anything depends on the dataset being single-cell, which is only known once the
  // result pool has resolved it. A bulk dataset simply ignores the value, and the
  // UI hides the selector rather than clearing it.
  if (scChain !== undefined && !SC_CHAINS.includes(scChain as string)) {
    throw new Error(`'scChain' must be one of: ${SC_CHAINS.join(", ")}.`);
  }
  if (allele !== undefined && typeof allele !== "boolean") {
    throw new Error("'allele' must be a boolean.");
  }
  if (weightedFlag !== undefined && typeof weightedFlag !== "boolean") {
    throw new Error("'weightedFlag' must be a boolean.");
  }
  if (customBlockLabel !== undefined && typeof customBlockLabel !== "string") {
    throw new Error("'customBlockLabel' must be a string.");
  }

  return {
    datasetRef,
    scChain: scChain as ScChain | undefined,
    allele,
    weightedFlag,
    customBlockLabel,
  };
}
