import type { InferOutputsType, PlRef } from '@platforma-sdk/model';
import { BlockModelV3, DataModelBuilder } from '@platforma-sdk/model';
import type { GraphMakerState } from '@milaboratories/graph-maker';
import { graphMakerPlugin } from '@milaboratories/graph-maker/plugin';
import { getDefaultBlockLabel } from './label';

// ---------------------------------------------------------------------------
// Block data versions
// ---------------------------------------------------------------------------

type OldArgs = {
  defaultBlockLabel: string;
  customBlockLabel: string;
  datasetRef?: PlRef;
  scChain?: string;
  allele?: boolean;
};

type OldUiState = {
  weightedFlag: boolean;
  vUsagePlotState: GraphMakerState;
  jUsagePlotState: GraphMakerState;
  vjUsagePlotState: GraphMakerState;
};

/** v1 block data — includes plot states that will be transferred to plugins */
type BlockDataV1 = {
  defaultBlockLabel: string;
  customBlockLabel: string;
  datasetRef?: PlRef;
  scChain?: string;
  allele?: boolean;
  weightedFlag: boolean;
  vUsagePlotState: GraphMakerState;
  jUsagePlotState: GraphMakerState;
  vjUsagePlotState: GraphMakerState;
};

/** v2 block data — plot states live in plugins */
export type BlockData = {
  defaultBlockLabel: string;
  customBlockLabel: string;
  datasetRef?: PlRef;
  scChain?: string;
  allele?: boolean;
  weightedFlag: boolean;
};

// ---------------------------------------------------------------------------
// Plugin instances
// ---------------------------------------------------------------------------

const vUsagePlugin = graphMakerPlugin.create({
  pluginId: 'vUsage',
  transferAt: 'v1',
  config: {
    chartType: 'heatmap',
    initialTitle: 'V Usage',
    initialTemplate: 'heatmapClustered',
    initialState: {
      currentTab: 'settings',
      layersSettings: { heatmapClustered: { normalizationDirection: null } },
    },
    readonlyInputs: ['value'],
  },
});

const jUsagePlugin = graphMakerPlugin.create({
  pluginId: 'jUsage',
  transferAt: 'v1',
  config: {
    chartType: 'heatmap',
    initialTitle: 'J Usage',
    initialTemplate: 'heatmapClustered',
    initialState: {
      layersSettings: { heatmapClustered: { normalizationDirection: null } },
    },
    readonlyInputs: ['value'],
  },
});

const vjUsagePlugin = graphMakerPlugin.create({
  pluginId: 'vjUsage',
  transferAt: 'v1',
  config: {
    chartType: 'heatmap',
    initialTitle: 'V/J Usage',
    initialTemplate: 'heatmapClustered',
    initialState: {
      layersSettings: { heatmapClustered: { normalizationDirection: null } },
    },
    readonlyInputs: ['value'],
  },
});

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

const dataModel = new DataModelBuilder()
  .from<BlockDataV1>('v1')
  .upgradeLegacy<OldArgs, OldUiState>(({ args, uiState }) => ({
    defaultBlockLabel: args.defaultBlockLabel,
    customBlockLabel: args.customBlockLabel,
    datasetRef: args.datasetRef,
    scChain: args.scChain,
    allele: args.allele,
    weightedFlag: uiState.weightedFlag,
    vUsagePlotState: uiState.vUsagePlotState,
    jUsagePlotState: uiState.jUsagePlotState,
    vjUsagePlotState: uiState.vjUsagePlotState,
  }))
  .transfer(vUsagePlugin, (v1) => ({
    state: v1.vUsagePlotState,
    selection: undefined,
    chartType: 'heatmap' as const,
    readonlyInputs: ['value'],
    allowChartDeleting: false,
    allowTitleEditing: false,
  }))
  .transfer(jUsagePlugin, (v1) => ({
    state: v1.jUsagePlotState,
    selection: undefined,
    chartType: 'heatmap' as const,
    readonlyInputs: ['value'],
    allowChartDeleting: false,
    allowTitleEditing: false,
  }))
  .transfer(vjUsagePlugin, (v1) => ({
    state: v1.vjUsagePlotState,
    selection: undefined,
    chartType: 'heatmap' as const,
    readonlyInputs: ['value'],
    allowChartDeleting: false,
    allowTitleEditing: false,
  }))
  .migrate<BlockData>('v2', ({ vUsagePlotState: _v, jUsagePlotState: _j, vjUsagePlotState: _vj, ...rest }) => rest)
  .init(() => ({
    defaultBlockLabel: getDefaultBlockLabel({
      allele: false,
      isSingleCell: false,
    }),
    customBlockLabel: '',
    scChain: 'A',
    allele: false,
    weightedFlag: true,
  }));

// ---------------------------------------------------------------------------
// Block model
// ---------------------------------------------------------------------------

export const platforma = BlockModelV3.create(dataModel)

  .args((data) => {
    if (!data.datasetRef) throw new Error('Dataset is required');
    return {
      customBlockLabel: data.customBlockLabel,
      datasetRef: data.datasetRef,
      scChain: data.scChain,
      allele: data.allele,
    };
  })

  .output('datasetOptions', (ctx) =>
    ctx.resultPool.getOptions([{
      axes: [
        { name: 'pl7.app/sampleId' },
        { name: 'pl7.app/vdj/clonotypeKey' },
      ],
      annotations: { 'pl7.app/isAnchor': 'true' },
    }, {
      axes: [
        { name: 'pl7.app/sampleId' },
        { name: 'pl7.app/vdj/scClonotypeKey' },
      ],
      annotations: { 'pl7.app/isAnchor': 'true' },
    }],
    {
      label: { includeNativeLabel: false },
    }),
  )

  .output('datasetSpec', (ctx) => {
    if (ctx.data.datasetRef === undefined) {
      return undefined;
    }
    return ctx.resultPool.getPColumnSpecByRef(ctx.data.datasetRef);
  })

  .output('isRunning', (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title(() => 'V/J Usage')

  .subtitle((ctx) => ctx.data.customBlockLabel || ctx.data.defaultBlockLabel)

  .sections((_) => [
    { type: 'link', href: '/', label: 'V Gene Usage' },
    { type: 'link', href: '/jUsage', label: 'J Gene Usage' },
    { type: 'link', href: '/vjUsage', label: 'V/J Gene Usage' },
  ])

  .plugin(vUsagePlugin, {
    blockColumns: (ctx) => ctx.outputs?.resolve('pf')?.getPColumns(),
  })

  .plugin(jUsagePlugin, {
    blockColumns: (ctx) => ctx.outputs?.resolve('pf')?.getPColumns(),
  })

  .plugin(vjUsagePlugin, {
    blockColumns: (ctx) => ctx.outputs?.resolve('pf')?.getPColumns(),
  })

  .done();

export type BlockOutputs = InferOutputsType<typeof platforma>;

export { getDefaultBlockLabel } from './label';
