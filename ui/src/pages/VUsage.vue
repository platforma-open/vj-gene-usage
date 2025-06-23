<script setup lang="ts">
import type { GraphMakerProps } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import type { PDataColumnSpec, PlRef } from '@platforma-sdk/model';
import { plRefsEqual } from '@platforma-sdk/model';
import { PlBtnGroup, PlDropdownRef } from '@platforma-sdk/ui-vue';
import { computed, useTemplateRef } from 'vue';
import { useApp } from '../app';

const app = useApp();

// Set name of the block based on the dataset
function setInput(inputRef?: PlRef) {
  app.model.args.datasetRef = inputRef;
  if (inputRef) {
    const datasetLabel = app.model.outputs.datasetOptions?.find((o) => plRefsEqual(o.ref, inputRef))?.label;
    if (datasetLabel)
      app.model.ui.blockTitle = 'V/J Usage - ' + datasetLabel;
  }
}

const defaultOptions = computed((): GraphMakerProps['defaultOptions'] => {
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

const graphMakerRef = useTemplateRef('graphMaker');

const setWeightedFlag = (flag: boolean) => {
  app.model.ui.weightedFlag = flag;
  graphMakerRef.value?.reset();
};
</script>

<template>
  <GraphMaker
    ref="graphMaker"
    v-model="app.model.ui.vUsagePlotState"
    chart-type="heatmap"
    :p-frame="app.model.outputs.pf"
    :default-options="defaultOptions"
    :readonly-inputs="['value']"
  >
    <template #titleLineSlot>
      <PlBtnGroup v-model="app.model.ui.weightedFlag" :options="weightOptions" @v-model:set="setWeightedFlag"/>
    </template>
    <template #settingsSlot>
      <PlDropdownRef
        v-model="app.model.args.datasetRef"
        :options="app.model.outputs.datasetOptions"
        label="Select dataset"
        clearable
        required
        @update:model-value="setInput"
      />
    </template>
  </GraphMaker>
</template>
