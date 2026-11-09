import { platforma } from "@platforma-open/milaboratories.vj-usage.model";
import { plRefsEqual } from "@platforma-sdk/model";
import { defineAppV3 } from "@platforma-sdk/ui-vue";
import { computed, watch } from "vue";
import JUsage from "./pages/JUsage.vue";
import VJUsage from "./pages/VJUsage.vue";
import VUsage from "./pages/VUsage.vue";
import { useScChainOptions } from "./utils";

export const sdkPlugin = defineAppV3(platforma, (app) => {
  syncSubtitleLabel(app.model);
  keepSettingsValid(app.model);

  return {
    routes: {
      "/": () => VUsage,
      "/jUsage": () => JUsage,
      "/vjUsage": () => VJUsage,
    },
  };
});

export const useApp = sdkPlugin.useApp;

type AppModel = ReturnType<typeof useApp>["model"];

// `subtitleLabel` never reaches args, so following the pool here cannot stale the block.
function syncSubtitleLabel(model: AppModel) {
  // The subset's label when one is picked: it already carries the dataset as a prefix.
  // "" when no dataset is picked; undefined while the picked dataset or subset is not
  // among the options yet.
  const subtitleLabel = computed<string | undefined>(() => {
    const { datasetRef, filterRef } = model.data;
    if (!datasetRef) return "";
    const option = model.outputs.datasetOptions?.find((o) =>
      plRefsEqual(o.primary.ref, datasetRef, true),
    );
    if (!option) return undefined;
    if (!filterRef) return option.primary.label;
    return option.filters?.find((f) => plRefsEqual(f.ref, filterRef, true))?.label;
  });

  watch(
    subtitleLabel,
    (label) => {
      if (label !== undefined && label !== model.data.subtitleLabel)
        model.data.subtitleLabel = label;
    },
    { immediate: true },
  );
}

function keepSettingsValid(model: AppModel) {
  const isSingleCell = computed(() => model.outputs.isSingleCell ?? false);
  const scChainOptions = useScChainOptions(
    () => model.outputs.datasetSpec,
    () => model.outputs.availableScChains,
  );

  // Keep scChain valid: if the persisted chain isn't among the chains that actually
  // have columns, reset it to the first available one. Covers switching a block from a
  // paired IG dataset (Light picked) to a heavy-only VHH one, where the selector then
  // hides and can no longer be corrected by hand.
  watch(
    [isSingleCell, scChainOptions],
    ([isSc, opts]) => {
      if (!isSc || !opts || opts.length === 0) return;
      if (!opts.some((o) => o.value === model.data.scChain)) {
        model.data.scChain = opts[0].value;
      }
    },
    { immediate: true },
  );
}
