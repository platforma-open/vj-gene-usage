import { getDefaultBlockLabel, model } from '@platforma-open/milaboratories.vj-usage.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import { computed, watchEffect } from 'vue';
import JUsage from './pages/JUsage.vue';
import VJUsage from './pages/VJUsage.vue';
import VUsage from './pages/VUsage.vue';
import { useIsSingleCell, useScChainOptions } from './utils';

export const sdkPlugin = defineApp(model, (app) => {
  app.model.args.customBlockLabel ??= '';

  syncDefaultBlockLabel(app.model);

  return {
    routes: {
      '/': () => VUsage,
      '/jUsage': () => JUsage,
      '/vjUsage': () => VJUsage,
    },
  };
});

export const useApp = sdkPlugin.useApp;

type AppModel = ReturnType<typeof useApp>['model'];

function syncDefaultBlockLabel(model: AppModel) {
  const datasetSpecRef = computed(() => model.outputs.datasetSpec);
  const isSingleCell = useIsSingleCell(datasetSpecRef);
  const scChainOptions = useScChainOptions(datasetSpecRef);

  watchEffect(() => {
    const datasetLabel = model.args.datasetRef
      ? model.outputs.datasetOptions
        ?.find((option) => option.ref === model.args.datasetRef)
        ?.label
      : undefined;

    // Get chain label for single-cell datasets
    const chainLabel = isSingleCell.value
      ? scChainOptions.value?.find((o) => o.value === model.args.scChain)?.label
      : undefined;

    model.args.defaultBlockLabel = getDefaultBlockLabel({
      datasetLabel,
      allele: model.args.allele ?? false,
      isSingleCell: isSingleCell.value,
      chainLabel,
    });
  });
}
