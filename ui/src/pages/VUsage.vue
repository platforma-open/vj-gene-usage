<script setup lang="ts">
import type { PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import type { PDataColumnSpec } from '@platforma-sdk/model';
import { PlBtnGroup } from '@platforma-sdk/ui-vue';
import strings from '@milaboratories/strings';
import { computed, watch } from 'vue';
import { useApp } from '../app';
import Settings from './Settings.vue';

const app = useApp();

// Auto-close settings panel when block starts running
watch(
  () => app.model.outputs.isRunning,
  (isRunning, wasRunning) => {
    // Close settings when block starts running (false -> true transition)
    if (isRunning && !wasRunning) {
      // Close the settings tab by setting currentTab to null
      app.model.ui.vUsagePlotState.currentTab = null;
    }
  },
);

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
    pf: app.model.outputs.pf.ok ? app.model.outputs.pf.value : undefined,
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
    :status-text="{ noPframe: { title: strings.callToActions.configureSettingsAndRun } }"
  >
    <template #titleLineSlot>
      <PlBtnGroup v-model="app.model.ui.weightedFlag" :options="weightOptions" />
    </template>
    <template #settingsSlot>
      <Settings/>
    </template>
  </GraphMaker>
</template>
