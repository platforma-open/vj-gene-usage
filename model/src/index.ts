import type { InferOutputsType } from "@platforma-sdk/model";
import { BlockModelV3, createPFrameForGraphs, isPColumnSpec } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.vj-usage.kind";
import { blockDataModel } from "./dataModel";
import { chainsWithGenes, isBareSetAxis, isDatasetSpec, isPairedDataset } from "./dataset";
import { deriveTemplateParams } from "./templateParams";
import type { BlockArgs } from "./types";

export { blockDataModel, initBlockData } from "./dataModel";
export { deriveTemplateParams } from "./templateParams";
export { getDefaultBlockLabel } from "./label";
export type { BlockArgs, BlockData } from "./types";
export type * from "@platforma-open/milaboratories.vj-usage.kind";

/** A usage needs both genes on a chain; either alone gives no V/J pair. */
const GENES = ["VGene", "JGene"];

export const platforma = BlockModelV3.create({ dataModel: blockDataModel, kind })
  .args<BlockArgs>((data) => {
    if (data.datasetRef === undefined) throw new Error("Dataset is required");
    return {
      datasetRef: data.datasetRef,
      scChain: data.scChain,
      allele: data.allele,
      customBlockLabel: data.customBlockLabel,
    };
  })

  .templateParams(deriveTemplateParams)

  // MiXCR datasets always carry V and J gene columns; an imported (bare) set carries them only
  // when the file mapped them, so one without a V and J on some chain is not offered at all.
  .output("datasetOptions", (ctx) =>
    ctx.resultPool
      .getOptions((spec) => isPColumnSpec(spec) && isDatasetSpec(spec), {
        // suppress native label of the column (e.g. "Number of Reads") to show only the dataset label
        label: { includeNativeLabel: false },
      })
      .filter(
        (option) =>
          !isBareSetAxis(ctx.resultPool.getPColumnSpecByRef(option.ref)?.axesSpec[1]) ||
          (chainsWithGenes(ctx.resultPool, option.ref, GENES)?.length ?? 0) > 0,
      ),
  )

  .output("datasetSpec", (ctx) => {
    if (ctx.data.datasetRef === undefined) {
      return undefined;
    }

    return ctx.resultPool.getPColumnSpecByRef(ctx.data.datasetRef);
  })

  .output("isSingleCell", (ctx) => {
    const ref = ctx.data.datasetRef;
    if (ref === undefined) return undefined;
    return isPairedDataset(ctx.resultPool, ref);
  })

  // Chain letters ("A" / "B") that actually have V and J gene columns for the selected paired
  // dataset. Returns undefined — meaning "don't filter" — for unpaired data and while the pool
  // is resolving. Heavy-only VHH and imported sets with genes mapped for one chain only are
  // what this narrows.
  .output("availableScChains", (ctx) => {
    const ref = ctx.data.datasetRef;
    if (ref === undefined) return undefined;
    if (!isPairedDataset(ctx.resultPool, ref)) return undefined;
    return chainsWithGenes(ctx.resultPool, ref, GENES)?.filter((letter) => letter !== "");
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
