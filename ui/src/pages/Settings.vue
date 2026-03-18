<script setup lang="ts">
import type { PlRef } from '@platforma-sdk/model';
import {
  PlBtnGroup,
  PlDropdownRef,
  PlTextField,
} from '@platforma-sdk/ui-vue';
import { computed } from 'vue';
import { useApp } from '../app';
import { alleleOptions, useIsSingleCell, useScChainOptions } from '../utils';

const app = useApp();
// Set dataset
function setInput(inputRef?: PlRef) {
  app.model.data.datasetRef = inputRef;
}

const isSingleCell = useIsSingleCell(computed(() => app.model.outputs.datasetSpec));
const scChainOptions = useScChainOptions(computed(() => app.model.outputs.datasetSpec));

</script>

<template>
  <PlDropdownRef
    v-model="app.model.data.datasetRef"
    :options="app.model.outputs.datasetOptions"
    label="Select dataset"
    clearable
    required
    @update:model-value="setInput"
  />

  <PlTextField
    v-model="app.model.data.customBlockLabel"
    label="Block title"
    :clearable="true"
    :placeholder="app.model.data.defaultBlockLabel"
  />

  <PlBtnGroup
    v-model="app.model.data.allele"
    label="Group by"
    :options="alleleOptions"
  >
    <template #tooltip>
      Defines whether to group data by genes or by allelic variants.
    </template>
  </PlBtnGroup>

  <PlBtnGroup
    v-if="isSingleCell"
    v-model="app.model.data.scChain"
    :options="scChainOptions ?? []"
  />
</template>
