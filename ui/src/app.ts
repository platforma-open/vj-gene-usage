import { isJsonEqual } from '@milaboratories/helpers';
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
  const isSingleCell = useIsSingleCell(() => model.outputs.datasetSpec);
  const scChainOptions = useScChainOptions(() => model.outputs.datasetSpec);

  const datasetLabel = computed(() => {
    if (!model.args.datasetRef) return;
    return model.outputs.datasetOptions
      ?.find((option) => isJsonEqual(option.ref, model.args.datasetRef))
      ?.label;
  });

  // Get chain label for single-cell datasets
  const chainLabel = computed(() => {
    if (!isSingleCell.value) return;
    return scChainOptions.value?.find((o) => o.value === model.args.scChain)?.label;
  });

  watchEffect(() => {
    model.args.defaultBlockLabel = getDefaultBlockLabel({
      datasetLabel: datasetLabel.value,
      allele: model.args.allele ?? false,
      isSingleCell: isSingleCell.value,
      chainLabel: chainLabel.value,
    });
  });
}
