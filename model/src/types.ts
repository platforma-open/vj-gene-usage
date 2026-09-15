import type { GraphMakerState } from "@milaboratories/graph-maker";
import type { PlRef } from "@platforma-sdk/model";
// The chain letter lives in the kind: its init-params contract names it, and a kind
// cannot import from the model.
import type { ScChain } from "@platforma-open/milaboratories.vj-usage.kind";

export type * from "@platforma-open/milaboratories.vj-usage.kind";

/**
 * Unified V3 data — the UI's persisted state. The three plot states,
 * `weightedFlag`, and `defaultBlockLabel` are display-only; the args lambda
 * projects only the analysis inputs (+ `customBlockLabel` for the trace).
 */
export type BlockData = {
  datasetRef?: PlRef;
  scChain?: ScChain;
  allele?: boolean;
  defaultBlockLabel: string;
  customBlockLabel: string;
  weightedFlag: boolean;
  vUsagePlotState: GraphMakerState;
  jUsagePlotState: GraphMakerState;
  vjUsagePlotState: GraphMakerState;
};

/**
 * Workflow-facing args. `defaultBlockLabel` and the plot/view state are not
 * projected; `customBlockLabel` is — the workflow uses it as the trace label.
 * `datasetRef` is required: the args lambda throws when absent.
 */
export type BlockArgs = {
  datasetRef: PlRef;
  scChain?: ScChain;
  allele?: boolean;
  customBlockLabel: string;
};

/** Legacy V1 on-disk shapes, consumed once by `.upgradeLegacy`. */
export type LegacyBlockArgs = {
  defaultBlockLabel: string;
  customBlockLabel: string;
  datasetRef?: PlRef;
  scChain?: ScChain;
  allele?: boolean;
};
export type LegacyUiState = {
  weightedFlag: boolean;
  vUsagePlotState: GraphMakerState;
  jUsagePlotState: GraphMakerState;
  vjUsagePlotState: GraphMakerState;
};
