<script setup lang="ts">
import type { PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup } from '@platforma-sdk/ui-vue';
import { computed, ref, useTemplateRef } from 'vue';
import { useApp } from '../app';

const app = useApp();

function createDefaultOptions(weightedFlag:boolean):PredefinedGraphOption<'heatmap'>[] {
  const mainCol: PDataColumnSpec = {
    kind: 'PColumn',
    valueType: 'Double',
    name: 'pl7.app/vdj/jGeneUsage',
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
        name: 'pl7.app/vdj/jGene',
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
    v-model="app.model.ui.jUsagePlotState"
    chart-type="heatmap"
    :p-frame="app.model.outputs.pf"
    :default-options="defaultOptions"
    :readonly-inputs="['value']"
  >
    <template #titleLineSlot>
      <PlBtnGroup v-model="weightedFlag" :options="weightOptions" />
    </template>
  </GraphMaker>
</template>
