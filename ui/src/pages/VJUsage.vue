<script setup lang="ts">
import type { PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMakerPlugin } from '@milaboratories/graph-maker';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup } from '@platforma-sdk/ui-vue';
import strings from '@milaboratories/strings';
import { computed } from 'vue';
import { useApp } from '../app';

const app = useApp();

const defaultOptions = computed((): PredefinedGraphOption<'heatmap'>[] => {
  const mainCol: PDataColumnSpec = {
    kind: 'PColumn',
    valueType: 'Double',
    name: 'pl7.app/vdj/vjGeneUsage',
    domain: {
      'pl7.app/vdj/vjGeneUsage/type': app.model.data.weightedFlag ? 'weighted' : 'unweighted',
    },
    axesSpec: [],
  };
  return [
    { inputName: 'value', selectedSource: mainCol },
    { inputName: 'x', selectedSource: { type: 'String', name: 'pl7.app/vdj/vGene' } },
    { inputName: 'y', selectedSource: { type: 'String', name: 'pl7.app/vdj/jGene' } },
    { inputName: 'tabBy', selectedSource: { type: 'String', name: 'pl7.app/sampleId' } },
  ];
});

const weightOptions = [
  { label: 'Weighted', value: true },
  { label: 'Unweighted', value: false },
];
</script>

<template>
  <GraphMakerPlugin
    :instance="app.plugins.vjUsage"
    :default-options="defaultOptions"
    :status-text="{ noPframe: { title: strings.callToActions.configureSettingsAndRun } }"
  >
    <template #titleLineSlot>
      <PlBtnGroup v-model="app.model.data.weightedFlag" :options="weightOptions" />
    </template>
  </GraphMakerPlugin>
</template>
