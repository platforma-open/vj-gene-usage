<script setup lang="ts">
import '@milaboratories/graph-maker/styles';
import type { PlRef } from '@platforma-sdk/model';
import { plRefsEqual } from '@platforma-sdk/model';
import { PlBtnGroup, PlDropdownRef } from '@platforma-sdk/ui-vue';
import { computed } from 'vue';
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

const isSingleCell = computed(() => {
  return app.model.outputs.datasetSpec?.axesSpec[1].name === 'pl7.app/vdj/scClonotypeKey';
});

const scChainOptions = computed(() => {
  const spec = app.model.outputs.datasetSpec;
  if (!spec) {
    return undefined;
  }

  const axisSpec = spec.axesSpec[1];
  if (!axisSpec) {
    return undefined;
  }

  const receptor = axisSpec.domain?.['pl7.app/vdj/receptor'];

  switch (receptor) {
    case 'IG':
      return [
        { label: 'Heavy', value: 'A' },
        { label: 'Light', value: 'B' },
      ];
    case 'TCRAB':
      return [
        { label: 'Alpha', value: 'A' },
        { label: 'Beta', value: 'B' },
      ];
    case 'TCRGD':
      return [
        { label: 'Gamma', value: 'A' },
        { label: 'Delta', value: 'B' },
      ];
    default:
      return [];
  }
});

const alleleOptions = computed(() => {
  return [
    { label: 'Allele', value: true },
    { label: 'Gene', value: false },
  ];
});

</script>

<template>
  <PlDropdownRef
    v-model="app.model.args.datasetRef"
    :options="app.model.outputs.datasetOptions"
    label="Select dataset"
    clearable
    required
    @update:model-value="setInput"
  />

  <PlBtnGroup
    v-model="app.model.args.allele"
    label="Group by"
    :options="alleleOptions"
  >
    <template #tooltip>
      Defines whether to group data by genes or by allelic variants.
    </template>
  </PlBtnGroup>

  <PlBtnGroup
    v-if="isSingleCell"
    v-model="app.model.args.scChain"
    :options="scChainOptions ?? []"
  />
</template>
