<script setup lang="ts">
import { GraphMaker, PredefinedGraphOption } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup } from '@platforma-sdk/ui-vue';
import { computed } from 'vue';
import { useApp } from '../app';
import Settings from './Settings.vue';

const app = useApp();

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

const setWeightedFlag = (flag: boolean) => {
  app.model.ui.weightedFlag = flag;
};
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
      <PlBtnGroup v-model="app.model.ui.weightedFlag" :options="weightOptions" @v-model:set="setWeightedFlag"/>
    </template>
    <template #settingsSlot>
      <Settings/>
    </template>
  </GraphMaker>
</template>
