<script setup lang="ts">
import type { PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup } from '@platforma-sdk/ui-vue';
import { computed, watchEffect } from 'vue';
import { useApp } from '../app';
import { useIsSingleCell, useScChainOptions } from './constants';
import Settings from './Settings.vue';

const app = useApp();

// Build defaultBlockLabel from dataset name, allele selection and chain (for single-cell)
const isSingleCell = useIsSingleCell(computed(() => app.model.outputs.datasetSpec));
const scChainOptions = useScChainOptions(computed(() => app.model.outputs.datasetSpec));

watchEffect(() => {
  const parts: string[] = [];
  // Add dataset name
  if (app.model.args.datasetRef) {
    const selectedOption = app.model.outputs.datasetOptions?.find(
      (option) => option.ref === app.model.args.datasetRef,
    );
    if (selectedOption?.label) {
      parts.push(selectedOption.label);
    }
  }
  // Add allele/gene
  parts.push(app.model.args.allele ? 'Allele' : 'Gene');
  // Add chain info for single-cell datasets
  if (isSingleCell.value && scChainOptions.value) {
    const chainLabel = scChainOptions.value.find((o) => o.value === app.model.args.scChain)?.label;
    if (chainLabel) {
      parts.push(chainLabel);
    }
  }
  app.model.args.defaultBlockLabel = parts.join(' - ');
});

const defaultOptions = computed((): PredefinedGraphOption<'heatmap'>[] => {
  const mainCol: PDataColumnSpec = {
    kind: 'PColumn',
    valueType: 'Double',
    name: 'pl7.app/vdj/vGeneUsage',
    domain: {
      'pl7.app/vdj/vjGeneUsage/type': app.model.ui.weightedFlag ? 'weighted' : 'unweighted',
    },
    axesSpec: [],
  };
  return [
    {
      inputName: 'value',
      selectedSource: mainCol,
    },
    {
      inputName: 'y',
      selectedSource: {
        type: 'String',
        name: 'pl7.app/vdj/vGene',
      },
    },
    {
      inputName: 'x',
      selectedSource: {
        type: 'String',
        name: 'pl7.app/sampleId',
      },
    },
  ];
});

const weightOptions = [
  {
    label: 'Weighted',
    value: true,
  },
  {
    label: 'Unweighted',
    value: false,
  },
];

const statKey = computed(() => {
  return {
    pf: app.model.outputs.pf,
    weightedFlag: app.model.ui.weightedFlag,
  };
});

</script>

<template>
  <GraphMaker
    ref="graphMaker"
    v-model="app.model.ui.vUsagePlotState"
    :data-state-key="statKey"
    chart-type="heatmap"
    :p-frame="app.model.outputs.pf"
    :default-options="defaultOptions"
    :readonly-inputs="['value']"
  >
    <template #titleLineSlot>
      <PlBtnGroup v-model="app.model.ui.weightedFlag" :options="weightOptions" />
    </template>
    <template #settingsSlot>
      <Settings/>
    </template>
  </GraphMaker>
</template>
