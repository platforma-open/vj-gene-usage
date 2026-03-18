<script setup lang="ts">
import type { PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMaker, useGraphMakerPlugin } from '@milaboratories/graph-maker';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup } from '@platforma-sdk/ui-vue';
import strings from '@milaboratories/strings';
import { computed, watch } from 'vue';
import { useApp } from '../app';
import Settings from './Settings.vue';

const app = useApp();
const graphMakerPlugin = useGraphMakerPlugin<'heatmap'>(app.plugins.vUsage);

// Auto-close settings panel when block starts running
watch(
  () => app.model.outputs.isRunning,
  (isRunning, wasRunning) => {
    if (isRunning && !wasRunning) {
      graphMakerPlugin.state.currentTab = null;
    }
  },
);

const defaultOptions = computed((): PredefinedGraphOption<'heatmap'>[] => {
  const mainCol: PDataColumnSpec = {
    kind: 'PColumn',
    valueType: 'Double',
    name: 'pl7.app/vdj/vGeneUsage',
    domain: {
      'pl7.app/vdj/vjGeneUsage/type': app.model.data.weightedFlag ? 'weighted' : 'unweighted',
    },
    axesSpec: [],
  };
  return [
    { inputName: 'value', selectedSource: mainCol },
    { inputName: 'y', selectedSource: { type: 'String', name: 'pl7.app/vdj/vGene' } },
    { inputName: 'x', selectedSource: { type: 'String', name: 'pl7.app/sampleId' } },
  ];
});

const weightOptions = [
  { label: 'Weighted', value: true },
  { label: 'Unweighted', value: false },
];

</script>

<template>
  <GraphMaker
    v-model="graphMakerPlugin.state"
    v-bind="graphMakerPlugin.props"
    :default-options="defaultOptions"
    :status-text="{ noPframe: { title: strings.callToActions.configureSettingsAndRun } }"
  >
    <template #titleLineSlot>
      <PlBtnGroup v-model="app.model.data.weightedFlag" :options="weightOptions" />
    </template>
    <template #settingsSlot>
      <Settings/>
    </template>
  </GraphMaker>
</template>
