<script setup lang="ts">
import { GraphMaker, PredefinedGraphOption } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup, PlDropdown, PlDropdownRef } from '@platforma-sdk/ui-vue';
import { computed, ref, useTemplateRef } from 'vue';
import { useApp } from '../app';

const app = useApp();

function createDefaultOptions(weightedFlag:boolean):PredefinedGraphOption<'heatmap'>[] {
  const mainCol: PDataColumnSpec = {
    kind: 'PColumn',
    valueType: 'Double',
    name: 'pl7.app/vdj/vGeneUsage',
    domain: {
      'pl7.app/vdj/vjGeneUsage/type': weightedFlag ? 'weighted' : 'unweighted',
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
}
const defaultOptions = ref(createDefaultOptions(app.model.ui.weightedFlag));

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

const weightedFlag = computed({
  get: () => {
    return app.model.ui.weightedFlag;
  },
  set: (flag:boolean) => {
    app.model.ui.weightedFlag = flag;
    defaultOptions.value = createDefaultOptions(flag);
    graphMakerRef.value?.reset();
  }
});
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
      <PlBtnGroup v-model="weightedFlag" :options="weightOptions" />
    </template>
    <template #settingsSlot>
      <PlDropdownRef
        v-model="app.model.args.vGeneRef"
        :options="app.model.outputs.vGeneOptions"
        label="V gene"
        required
      />

      <PlDropdown
        v-model="app.model.args.jGeneRef"
        :options="app.model.outputs.jGeneOptions"
        label="J gene"
        required
      />

      <PlDropdown
        v-model="app.model.args.abundanceRef"
        :options="app.model.outputs.abundanceOptions"
        label="Abundance (weight)"
        required
      />
    </template>
  </GraphMaker>
</template>
