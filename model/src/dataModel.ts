import type { GraphMakerState } from "@milaboratories/graph-maker";
import { DataModelBuilder } from "@platforma-sdk/model";
import { getDefaultBlockLabel } from "./label";
import type { BlockData, LegacyBlockArgs, LegacyUiState } from "./types";

const usagePlot = (title: string, currentTab: GraphMakerState["currentTab"]): GraphMakerState => ({
  title,
  template: "heatmapClustered",
  currentTab,
  layersSettings: { heatmapClustered: { normalizationDirection: null } },
});

const initData = (): BlockData => ({
  datasetRef: undefined,
  scChain: "A",
  allele: false,
  defaultBlockLabel: getDefaultBlockLabel({ allele: false, isSingleCell: false }),
  customBlockLabel: "",
  weightedFlag: true,
  vUsagePlotState: usagePlot("V Usage", "settings"),
  jUsagePlotState: usagePlot("J Usage", null),
  vjUsagePlotState: usagePlot("V/J Usage", null),
});

export const blockDataModel = new DataModelBuilder()
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
  .init(initData);
