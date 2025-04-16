import type { GraphMakerState } from '@milaboratories/graph-maker';
import type { InferOutputsType, PlRef, SUniversalPColumnId } from '@platforma-sdk/model';
import { BlockModel, createPFrameForGraphs, isPColumnSpec } from '@platforma-sdk/model';

export type BlockArgs = {
  vGeneRef?: PlRef;
  jGeneRef?: SUniversalPColumnId;
  abundanceRef?: SUniversalPColumnId;
};

export type UiState = {
  blockTitle: string;
  weightedFlag: boolean;
  vUsagePlotState: GraphMakerState;
  jUsagePlotState: GraphMakerState;
  vjUsagePlotState: GraphMakerState;
};

export const model = BlockModel.create()

  .withArgs<BlockArgs>({})

  .withUiState<UiState>({
    blockTitle: 'V/J Usage',
    weightedFlag: true,
    vUsagePlotState: {
      title: 'V Usage',
      template: 'heatmap',
      currentTab: 'settings',
    },
    jUsagePlotState: {
      title: 'V Usage',
      template: 'heatmap',
      currentTab: null,
    },
    vjUsagePlotState: {
      title: 'V/J Usage',
      template: 'heatmap',
      currentTab: null,
    },
  })

  .argsValid((ctx) =>
    ctx.args.vGeneRef !== undefined
    && ctx.args.jGeneRef !== undefined
    && ctx.args.abundanceRef !== undefined,
  )

  .output('vGeneOptions', (ctx) =>
    ctx.resultPool.getOptions((c) =>
      isPColumnSpec(c) && c.valueType === 'String'
      && (c.name === 'pl7.app/vdj/geneHit' || c.name === 'pl7.app/vdj/geneHitWithAllele')
      && c.domain?.['pl7.app/vdj/reference'] === 'VGene',
    ))

  .output('jGeneOptions', (ctx) => {
    const inputRef = ctx.args.vGeneRef;
    if (inputRef === undefined) return undefined;
    const vGeneSpec = ctx.resultPool.getPColumnSpecByRef(inputRef);
    if (vGeneSpec === undefined) return undefined;
    return ctx.resultPool.getCanonicalOptions({ main: inputRef }, [
      {
        axes: [{ anchor: 'main', idx: 0 }],
        name: vGeneSpec.name,
        domain: {
          'pl7.app/vdj/reference': 'JGene',
          'pl7.app/vdj/scClonotypeChain': { anchor: 'main' },
          'pl7.app/vdj/scClonotypeChain/index': { anchor: 'main' },
        },
      },
    ], { ignoreMissingDomains: true });
  })

  .output('abundanceOptions', (ctx) => {
    const inputRef = ctx.args.vGeneRef;
    if (inputRef === undefined) return undefined;
    return ctx.resultPool.getCanonicalOptions({ main: inputRef },
      {
        axes: [{/* sampleId */}, { anchor: 'main', idx: 0 }],
        annotations: {
          'pl7.app/isAbundance': 'true',
          'pl7.app/abundance/normalized': 'false',
        },
      },
    );
  })

  .output('pf', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPFrameForGraphs(ctx, pCols);
  })

  .output('isRunning', (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title((ctx) => ctx.uiState?.blockTitle ?? 'V/J Usage')

  .sections((_) => [
    { type: 'link', href: '/', label: 'V Gene Usage' },
    { type: 'link', href: '/jUsage', label: 'J Gene Usage' },
    { type: 'link', href: '/vjUsage', label: 'V/J Gene Usage' },
  ])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
