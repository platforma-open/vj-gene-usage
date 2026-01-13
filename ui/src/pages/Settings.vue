<script setup lang="ts">
import '@milaboratories/graph-maker/styles';
import type { PlRef } from '@platforma-sdk/model';
import { PlBlockPage, PlBtnGroup, PlDropdownRef } from '@platforma-sdk/ui-vue';
import { computed, watchEffect } from 'vue';
import { useApp } from '../app';

const app = useApp();

// Set dataset
function setInput(inputRef?: PlRef) {
  app.model.args.datasetRef = inputRef;
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

// Build defaultBlockLabel from allele selection and chain (for single-cell)
watchEffect(() => {
  const parts: string[] = [];
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

</script>

<template>
  <PlBlockPage
    v-model:subtitle="app.model.args.customBlockLabel"
    :subtitle-placeholder="app.model.args.defaultBlockLabel"
    title="V/J Gene Usage"
  >
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
  </PlBlockPage>
</template>
