import { describe, expect, it } from "vitest";
import { kind } from "@platforma-open/milaboratories.vj-usage.kind";
import { initBlockData } from "./dataModel";
import { deriveTemplateParams } from "./templateParams";
import type { BlockData } from "./types";

/**
 * The three steps a project template actually takes between two blocks: the source block's
 * state is projected out, the file's params are read back by the kind, and the new block is
 * initialised from them. Anything one of the three drops is a setting the user has to make
 * again.
 */
const roundTrip = (data: BlockData): BlockData =>
  initBlockData(
    kind.parseInitializationParams(JSON.parse(JSON.stringify(deriveTemplateParams(data)))),
  );

const usagePlot = (title: string, currentTab: "settings" | null) => ({
  title,
  template: "heatmapClustered" as const,
  currentTab,
  layersSettings: { heatmapClustered: { normalizationDirection: null } },
});

const CONFIGURED: BlockData = {
  datasetRef: { __isRef: true, blockId: "b1", name: "pf/dataset" },
  scChain: "B",
  allele: true,
  defaultBlockLabel: "Donor 3 - Allele - Light",
  customBlockLabel: "run 7",
  weightedFlag: false,
  vUsagePlotState: usagePlot("moved", null),
  jUsagePlotState: usagePlot("moved", "settings"),
  vjUsagePlotState: usagePlot("moved", "settings"),
};

describe("export -> apply", () => {
  it("carries every field a user set", () => {
    const seeded = roundTrip(CONFIGURED);

    expect(seeded.datasetRef).toEqual(CONFIGURED.datasetRef);
    expect(seeded.scChain).toBe(CONFIGURED.scChain);
    expect(seeded.allele).toBe(CONFIGURED.allele);
    expect(seeded.weightedFlag).toBe(CONFIGURED.weightedFlag);
    expect(seeded.customBlockLabel).toBe(CONFIGURED.customBlockLabel);
  });

  it("is stable: seeding from the seeded block changes nothing", () => {
    const once = roundTrip(CONFIGURED);
    expect(roundTrip(once)).toEqual(once);
  });

  // `allele: false`, `weightedFlag: false` and an empty subtitle are the values a `??` default
  // would silently overwrite on the way back in. All three are ordinary states — usage starts
  // per gene, the plots start weighted, the subtitle starts empty — so the projection has to
  // return them unchanged.
  it("carries the falsy values a default would swallow", () => {
    const seeded = roundTrip({
      ...CONFIGURED,
      allele: false,
      weightedFlag: false,
      customBlockLabel: "",
    });

    expect(seeded.allele).toBe(false);
    expect(seeded.weightedFlag).toBe(false);
    expect(seeded.customBlockLabel).toBe("");
  });

  it("survives a half-configured block, which the panel reaches and the projection must return", () => {
    const seeded = roundTrip({ ...CONFIGURED, datasetRef: undefined, customBlockLabel: "" });

    expect(seeded.datasetRef).toBeUndefined();
    expect(seeded.scChain).toBe(CONFIGURED.scChain);
    expect(seeded.allele).toBe(CONFIGURED.allele);
  });

  it("seeds a block with no params at all from the defaults", () => {
    const fresh = initBlockData(undefined);

    expect(fresh.datasetRef).toBeUndefined();
    expect(fresh.scChain).toBe("A");
    expect(fresh.allele).toBe(false);
    expect(fresh.weightedFlag).toBe(true);
    expect(fresh.customBlockLabel).toBe("");
  });

  it("leaves the derived label to the panel, and agrees with it on the part it can compute", () => {
    // The watchEffect in ui/src/app.ts builds the same string from the dataset's and the chain's
    // option labels. `init` cannot reach either -- both come from the result pool -- so only the
    // allele/gene word is filled in here, and it must already match or the label would flicker
    // the moment the block is opened.
    const seeded = roundTrip(CONFIGURED);

    expect(seeded.defaultBlockLabel).not.toBe(CONFIGURED.defaultBlockLabel);
    expect(seeded.defaultBlockLabel).toBe("Allele");
    expect(roundTrip({ ...CONFIGURED, allele: false }).defaultBlockLabel).toBe("Gene");
  });

  it("resets the plot view state rather than carrying it", () => {
    const seeded = roundTrip(CONFIGURED);

    expect(seeded.vUsagePlotState.title).toBe("V Usage");
    expect(seeded.vUsagePlotState.currentTab).toBe("settings");
    expect(seeded.jUsagePlotState.title).toBe("J Usage");
    expect(seeded.jUsagePlotState.currentTab).toBeNull();
    expect(seeded.vjUsagePlotState.currentTab).toBeNull();
  });
});
