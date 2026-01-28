<script setup lang="ts">
import type { PlRef } from '@platforma-sdk/model';
import { PlBtnGroup, PlDropdownRef, PlTextField } from '@platforma-sdk/ui-vue';
import { computed } from 'vue';
import { useApp } from '../app';
import { alleleOptions, useIsSingleCell, useScChainOptions } from '../utils';

const app = useApp();

// Set dataset
function setInput(inputRef?: PlRef) {
  app.model.args.datasetRef = inputRef;
}

const isSingleCell = useIsSingleCell(computed(() => app.model.outputs.datasetSpec));
const scChainOptions = useScChainOptions(computed(() => app.model.outputs.datasetSpec));
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

  <PlTextField
    v-model="app.model.args.customBlockLabel"
    label="Block title"
    :clearable="true"
    :placeholder="app.model.args.defaultBlockLabel"
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
