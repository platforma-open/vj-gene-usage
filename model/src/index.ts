import type { InferOutputsType } from "@platforma-sdk/model";
import { BlockModelV3, createPFrameForGraphs } from "@platforma-sdk/model";
import { kind } from "@platforma-open/milaboratories.vj-usage.kind";
import { blockDataModel } from "./dataModel";
import { deriveTemplateParams } from "./templateParams";
import type { BlockArgs } from "./types";

export { blockDataModel, initBlockData } from "./dataModel";
export { deriveTemplateParams } from "./templateParams";
export { getDefaultBlockLabel } from "./label";
export type { BlockArgs, BlockData } from "./types";
export type * from "@platforma-open/milaboratories.vj-usage.kind";

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

  // Single-cell IG chain letters ("A" = heavy, "B" = light) that actually have columns
  // for the selected dataset. Returns undefined — meaning "don't filter" — for bulk
  // data, non-IG receptors, and while the pool is resolving.
  .output("availableScChains", (ctx) => {
    const ref = ctx.data.datasetRef;
    if (ref === undefined) return undefined;

    const spec = ctx.resultPool.getPColumnSpecByRef(ref);
    // Only single-cell IG can be single-chain (heavy-only VHH): bulk has no chain axis,
    // and single-cell TCR is always paired — nothing to filter in those cases.
    if (spec?.axesSpec[1]?.name !== "pl7.app/vdj/scClonotypeKey") return undefined;
    if (spec.axesSpec[1]?.domain?.["pl7.app/vdj/receptor"] !== "IG") return undefined;

    // Ask for the V-gene-hit column per chain
    const vGeneCols = ctx.resultPool.getAnchoredPColumns(
      { main: ref },
      [
        {
          axes: [{ anchor: "main", idx: 1 }],
          name: "pl7.app/vdj/geneHit",
          domain: { "pl7.app/vdj/reference": "VGene" },
        },
      ],
      { ignoreMissingDomains: true },
    );
    if (vGeneCols === undefined) return undefined; // pool still resolving

    const chains = new Set<string>();
    for (const col of vGeneCols) {
      const domain = col.spec.domain;
      if (domain?.["pl7.app/vdj/scClonotypeChain/index"] !== "primary") continue;
      const letter = domain?.["pl7.app/vdj/scClonotypeChain"];
      if (letter) chains.add(letter);
    }
    return [...chains].sort();
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
