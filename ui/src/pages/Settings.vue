<script setup lang="ts">
import { PlBtnGroup, PlDropdownRef, PlTextField } from "@platforma-sdk/ui-vue";
import { computed } from "vue";
import { useApp } from "../app";
import { alleleOptions, useScChainOptions } from "../utils";

const app = useApp();

const isSingleCell = computed(() => app.model.outputs.isSingleCell ?? false);
const scChainOptions = useScChainOptions(
  computed(() => app.model.outputs.datasetSpec),
  computed(() => app.model.outputs.availableScChains),
);
</script>

<template>
  <PlDropdownRef
    v-model="app.model.data.datasetRef"
    :options="app.model.outputs.datasetOptions"
    label="Select dataset"
    clearable
    required
  />

  <PlTextField
    v-model="app.model.data.customBlockLabel"
    label="Block title"
    :clearable="true"
    :placeholder="app.model.data.defaultBlockLabel"
  />

  <PlBtnGroup v-model="app.model.data.allele" label="Group by" :options="alleleOptions">
    <template #tooltip> Defines whether to group data by genes or by allelic variants. </template>
  </PlBtnGroup>

  <PlBtnGroup
    v-if="isSingleCell && (scChainOptions?.length ?? 0) > 1"
    v-model="app.model.data.scChain"
    :options="scChainOptions ?? []"
  />
</template>
