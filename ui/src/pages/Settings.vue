<script setup lang="ts">
import type { DatasetSelection } from "@platforma-sdk/model";
import { defaultSubtitle } from "@platforma-open/milaboratories.vj-usage.model";
import { createDatasetSelection, createPrimaryRef, plRefsEqual } from "@platforma-sdk/model";
import { PlBtnGroup, PlDatasetSelector, PlTextField } from "@platforma-sdk/ui-vue";
import { computed } from "vue";
import { useApp } from "../app";
import { alleleOptions, useScChainOptions } from "../utils";

const app = useApp();

const isSingleCell = computed(() => app.model.outputs.isSingleCell ?? false);
const scChainOptions = useScChainOptions(
  computed(() => app.model.outputs.datasetSpec),
  computed(() => app.model.outputs.availableScChains),
);

const datasetSelection = computed<DatasetSelection | undefined>({
  get: () => {
    const { datasetRef, filterRef } = app.model.data;
    if (datasetRef === undefined) return undefined;
    return createDatasetSelection(createPrimaryRef(datasetRef, filterRef));
  },
  set: (selection) => {
    app.model.data.datasetRef = selection?.primary.column;
    app.model.data.filterRef = selection?.primary.filter;
    app.model.data.subtitleLabel = pickedDatasetLabel();
  },
});

// The subset's label when one is picked: it already carries the dataset as a prefix.
function pickedDatasetLabel(): string {
  const { datasetRef, filterRef } = app.model.data;
  if (!datasetRef) return "";
  const option = app.model.outputs.datasetOptions?.find((o) =>
    plRefsEqual(o.primary.ref, datasetRef, true),
  );
  const filter = filterRef
    ? option?.filters?.find((f) => plRefsEqual(f.ref, filterRef, true))
    : undefined;
  return (filter ?? option?.primary)?.label ?? "";
}
</script>

<template>
  <PlDatasetSelector
    v-model="datasetSelection"
    :options="app.model.outputs.datasetOptions"
    label="Select dataset"
    clearable
    required
  />

  <PlTextField
    v-model="app.model.data.customBlockLabel"
    label="Block title"
    :clearable="true"
    :placeholder="defaultSubtitle(app.model.data)"
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
