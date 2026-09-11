import { describe, expect, it } from "vitest";
import { kind } from "./index";

const parse = (params: unknown) => kind.parseInitializationParams(params);

/** The reference form the dataset dropdown writes: an expanded `PlRef`. */
const DATASET_REF = { __isRef: true as const, blockId: "b1", name: "pf/dataset" };

describe("the envelope", () => {
  it("accepts an empty object — a fresh block has nothing configured", () => {
    expect(parse({})).toEqual({
      datasetRef: undefined,
      scChain: undefined,
      allele: undefined,
      weightedFlag: undefined,
      customBlockLabel: undefined,
    });
  });

  it.each([
    ["null", null],
    ["a string", "A"],
    ["a number", 1],
    ["an array", []],
  ])("rejects %s as the params object", (_label, params) => {
    expect(() => parse(params)).toThrow();
  });

  it("drops a key the contract does not name", () => {
    expect(parse({ vUsagePlotState: { title: "x" } })).not.toHaveProperty("vUsagePlotState");
  });

  it("round-trips a fully configured block", () => {
    const params = {
      datasetRef: DATASET_REF,
      scChain: "B" as const,
      allele: true,
      weightedFlag: false,
      customBlockLabel: "Beta chain, alleles",
    };
    expect(parse(params)).toEqual(params);
  });
});

describe("datasetRef", () => {
  it("accepts an expanded PlRef", () => {
    expect(parse({ datasetRef: DATASET_REF })).toMatchObject({ datasetRef: DATASET_REF });
  });

  it.each([
    ["a bare string", "pf/dataset"],
    ["null", null],
    ["an object missing the ref marker", { blockId: "b1", name: "pf/dataset" }],
    ["an object missing the block id", { __isRef: true, name: "pf/dataset" }],
    ["an object missing the name", { __isRef: true, blockId: "b1" }],
    ["an array", []],
  ])("rejects %s", (_label, datasetRef) => {
    expect(() => parse({ datasetRef })).toThrow("'datasetRef' must be a reference");
  });
});

describe("scChain", () => {
  it.each([["A"], ["B"]])("accepts %s", (scChain) => {
    expect(parse({ scChain })).toMatchObject({ scChain });
  });

  // The letter is checked as an envelope only. Whether a chain means anything depends on
  // the dataset being single-cell, and the contract cannot see the dataset — a bulk
  // dataset carrying "A" is a state the UI itself leaves behind when the selector hides.
  it("accepts a chain letter alongside no dataset at all", () => {
    expect(parse({ scChain: "B" })).toMatchObject({ scChain: "B", datasetRef: undefined });
  });

  // The letters are positional, not named: the words the user sees ("Heavy"/"Light",
  // "Alpha"/"Beta", "Gamma"/"Delta") come from the dataset's receptor, and only ever
  // map onto these two values.
  it.each([
    ["a chain letter the block does not use", "C"],
    ["a lowercase letter", "a"],
    ["a chain name the UI shows", "Heavy"],
    ["a number", 0],
  ])("rejects %s", (_label, scChain) => {
    expect(() => parse({ scChain })).toThrow("'scChain' must be one of");
  });
});

describe("allele", () => {
  it.each([[true], [false]])("accepts %s", (allele) => {
    expect(parse({ allele })).toMatchObject({ allele });
  });

  it.each([
    ["a string", "true"],
    ["a number", 1],
    ["null", null],
  ])("rejects %s", (_label, allele) => {
    expect(() => parse({ allele })).toThrow("'allele' must be a boolean");
  });
});

describe("weightedFlag", () => {
  it.each([[true], [false]])("accepts %s", (weightedFlag) => {
    expect(parse({ weightedFlag })).toMatchObject({ weightedFlag });
  });

  it.each([
    ["a string", "true"],
    ["a number", 1],
    ["null", null],
  ])("rejects %s", (_label, weightedFlag) => {
    expect(() => parse({ weightedFlag })).toThrow("'weightedFlag' must be a boolean");
  });
});

describe("customBlockLabel", () => {
  it("accepts a label the user typed", () => {
    expect(parse({ customBlockLabel: "Donor 3" })).toMatchObject({ customBlockLabel: "Donor 3" });
  });

  it("accepts the empty string the block is created with", () => {
    expect(parse({ customBlockLabel: "" })).toMatchObject({ customBlockLabel: "" });
  });

  it.each([
    ["a number", 1],
    ["null", null],
    ["an object", {}],
  ])("rejects %s", (_label, customBlockLabel) => {
    expect(() => parse({ customBlockLabel })).toThrow("'customBlockLabel' must be a string");
  });
});
