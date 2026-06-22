import type { InferOutputsType } from "@platforma-sdk/model";
import { BlockModelV3, createPFrameForGraphs } from "@platforma-sdk/model";
import { blockDataModel } from "./dataModel";
import type { BlockArgs } from "./types";

export { getDefaultBlockLabel } from "./label";
export { blockDataModel } from "./dataModel";
export type { BlockArgs, BlockData } from "./types";

export const platforma = BlockModelV3.create(blockDataModel)
  .args<BlockArgs>((data) => {
    if (data.datasetRef === undefined) throw new Error("Dataset is required");
    return {
      datasetRef: data.datasetRef,
      scChain: data.scChain,
      allele: data.allele,
      customBlockLabel: data.customBlockLabel,
    };
  })

  .output("datasetOptions", (ctx) =>
    ctx.resultPool.getOptions(
      [
        {
          axes: [{ name: "pl7.app/sampleId" }, { name: "pl7.app/vdj/clonotypeKey" }],
          annotations: { "pl7.app/isAnchor": "true" },
        },
        {
          axes: [{ name: "pl7.app/sampleId" }, { name: "pl7.app/vdj/scClonotypeKey" }],
          annotations: { "pl7.app/isAnchor": "true" },
        },
      ],
      {
        // suppress native label of the column (e.g. "Number of Reads") to show only the dataset label
        label: { includeNativeLabel: false },
      },
    ),
  )

  .output("datasetSpec", (ctx) => {
    if (ctx.data.datasetRef === undefined) {
      return undefined;
    }

    return ctx.resultPool.getPColumnSpecByRef(ctx.data.datasetRef);
  })

  .outputWithStatus("pf", (ctx) => {
    const pCols = ctx.outputs?.resolve("pf")?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPFrameForGraphs(ctx, pCols);
  })

  .output("isRunning", (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title(() => "V/J Usage")

  .subtitle((ctx) => ctx.data.customBlockLabel || ctx.data.defaultBlockLabel)

  .sections(() => [
    { type: "link" as const, href: "/" as const, label: "V Gene Usage" },
    { type: "link" as const, href: "/jUsage" as const, label: "J Gene Usage" },
    { type: "link" as const, href: "/vjUsage" as const, label: "V/J Gene Usage" },
  ])

  .done();

export type Platforma = typeof platforma;
export type BlockOutputs = InferOutputsType<typeof platforma>;
