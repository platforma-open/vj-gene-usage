import type { GraphMakerState } from '@milaboratories/graph-maker';
import type { InferOutputsType, PlRef } from '@platforma-sdk/model';
import { BlockModel, createPFrameForGraphs } from '@platforma-sdk/model';

export type BlockArgs = {
  defaultBlockLabel: string;
  customBlockLabel: string;
  datasetRef?: PlRef;
  scChain?: string;
  allele?: boolean;
};

export type UiState = {
  weightedFlag: boolean;
  vUsagePlotState: GraphMakerState;
  jUsagePlotState: GraphMakerState;
  vjUsagePlotState: GraphMakerState;
};

export const model = BlockModel.create()

  .withArgs<BlockArgs>({
    defaultBlockLabel: '',
    customBlockLabel: '',
    scChain: 'A',
    allele: false,
  })

  .withUiState<UiState>({
    weightedFlag: true,
    vUsagePlotState: {
      title: 'V Usage',
      template: 'heatmapClustered',
      currentTab: 'settings',
      layersSettings: {
        heatmapClustered: {
          normalizationDirection: null,
        },
      },
    },
    jUsagePlotState: {
      title: 'J Usage',
      template: 'heatmapClustered',
      currentTab: null,
      layersSettings: {
        heatmapClustered: {
          normalizationDirection: null,
        },
      },
    },
    vjUsagePlotState: {
      title: 'V/J Usage',
      template: 'heatmapClustered',
      currentTab: null,
      layersSettings: {
        heatmapClustered: {
          normalizationDirection: null,
        },
      },
    },
  })

  .argsValid((ctx) => ctx.args.datasetRef !== undefined)

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
      // suppress native label of the column (e.g. "Number of Reads") to show only the dataset label
      label: { includeNativeLabel: false },
    }),
  )

  .output('datasetSpec', (ctx) => {
    if (ctx.args.datasetRef === undefined) {
      return undefined;
    }

    return ctx.resultPool.getPColumnSpecByRef(ctx.args.datasetRef);
  })

  .outputWithStatus('pf', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPFrameForGraphs(ctx, pCols);
  })

  .output('isRunning', (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title(() => 'V/J Usage')

  .subtitle((ctx) => ctx.args.customBlockLabel || ctx.args.defaultBlockLabel)

  .sections((_) => [
    { type: 'link', href: '/', label: 'V Gene Usage' },
    { type: 'link', href: '/jUsage', label: 'J Gene Usage' },
    { type: 'link', href: '/vjUsage', label: 'V/J Gene Usage' },
  ])

  .done(2);

export type BlockOutputs = InferOutputsType<typeof model>;
