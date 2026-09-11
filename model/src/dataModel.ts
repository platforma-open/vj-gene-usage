import type { GraphMakerState } from "@milaboratories/graph-maker";
import { DataModelBuilder } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.vj-usage.kind";
import { getDefaultBlockLabel } from "./label";
import type { BlockData, BlockParams, LegacyBlockArgs, LegacyUiState } from "./types";

const usagePlot = (title: string, currentTab: GraphMakerState["currentTab"]): GraphMakerState => ({
  title,
  template: "heatmapClustered",
  currentTab,
  layersSettings: { heatmapClustered: { normalizationDirection: null } },
});

/**
 * The state a block starts life in, from the params a template seeded it with — the inverse
 * of `deriveTemplateParams` over every field a user sets by hand.
 *
 * Exported so the round-trip test can drive it directly: `.init` is the only consumer in
 * production, but a projection that drifts from this function is exactly the bug that ships
 * silently while every parser test stays green.
 */
export const initBlockData = (params?: BlockParams): BlockData => {
  const allele = params?.allele ?? false;
  return {
    datasetRef: params?.datasetRef,
    scChain: params?.scChain ?? "A",
    allele,
    // The dataset's and the chain's human labels come from the result pool, which `init`
    // cannot reach, so only the part computable from the params is filled in here. The
    // watchEffect in ui/src/app.ts replaces it with the full label once the pool resolves.
    defaultBlockLabel: getDefaultBlockLabel({ allele, isSingleCell: false }),
    customBlockLabel: params?.customBlockLabel ?? "",
    weightedFlag: params?.weightedFlag ?? true,
    vUsagePlotState: usagePlot("V Usage", "settings"),
    jUsagePlotState: usagePlot("J Usage", null),
    vjUsagePlotState: usagePlot("V/J Usage", null),
  };
};

export const blockDataModel = new DataModelBuilder({ kind })
  .from<BlockData>("v1")
  // V1 split analysis params + block labels across `args`; the three plot states
  // and `weightedFlag` lived under `uiState`. Fold both into unified `data`.
  .upgradeLegacy<LegacyBlockArgs, LegacyUiState>(({ args, uiState }) => {
    const allele = args?.allele ?? false;
    return {
      datasetRef: args?.datasetRef,
      scChain: args?.scChain ?? "A",
      allele,
      defaultBlockLabel:
        args?.defaultBlockLabel ?? getDefaultBlockLabel({ allele, isSingleCell: false }),
      customBlockLabel: args?.customBlockLabel ?? "",
      weightedFlag: uiState?.weightedFlag ?? true,
      vUsagePlotState: uiState?.vUsagePlotState ?? usagePlot("V Usage", "settings"),
      jUsagePlotState: uiState?.jUsagePlotState ?? usagePlot("J Usage", null),
      vjUsagePlotState: uiState?.vjUsagePlotState ?? usagePlot("V/J Usage", null),
    };
  })
  .init(({ params }) => initBlockData(params));
