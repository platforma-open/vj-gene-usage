import type { ScChain } from "@platforma-open/milaboratories.vj-usage.model";
import type { PColumnSpec } from "@platforma-sdk/model";
import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";

export const alleleOptions = [
  { label: "Allele", value: true },
  { label: "Gene", value: false },
] as const;

export function useScChainOptions(
  datasetSpec: MaybeRefOrGetter<PColumnSpec | undefined>,
  availableChains: MaybeRefOrGetter<string[] | undefined>,
) {
  return computed(() => {
    const spec = toValue(datasetSpec);
    if (!spec) {
      return undefined;
    }

    const axisSpec = spec.axesSpec[1];
    if (!axisSpec) {
      return undefined;
    }

    const receptor = axisSpec.domain?.["pl7.app/vdj/receptor"];

    // Values are the producers' (mixcr-clonotyping, import-vdj-data): A is the more diverse
    // chain. Array order is display order, kept in the classic annotation order.
    let options: { label: string; value: ScChain }[];
    switch (receptor) {
      case "IG":
        options = [
          { label: "Heavy", value: "A" },
          { label: "Light", value: "B" },
        ];
        break;
      case "TCRAB":
        options = [
          { label: "Alpha", value: "B" },
          { label: "Beta", value: "A" },
        ];
        break;
      case "TCRGD":
        options = [
          { label: "Gamma", value: "B" },
          { label: "Delta", value: "A" },
        ];
        break;
      default:
        // No receptor on the axis: name the chains by letter rather than offering none, so a
        // paired dataset still gets a selector and a saved chain that is absent gets corrected.
        options = [
          { label: "Chain A", value: "A" },
          { label: "Chain B", value: "B" },
        ];
    }

    // Only offer chains that actually have columns. While the presence list is
    // still resolving (undefined), fall back to the full receptor-derived list.
    const available = toValue(availableChains);
    if (available === undefined) {
      return options;
    }
    return options.filter((o) => available.includes(o.value));
  });
}
