import type { BlockData } from "./types";

/**
 * Subtitle shown when the user has not set a custom block label: the dataset's label, then
 * whether usage is counted per allele or per gene. The chain is not named: its name ("Heavy",
 * "Alpha", …) depends on the dataset's receptor, which the subtitle cannot see.
 */
export function defaultSubtitle(data: Pick<BlockData, "subtitleLabel" | "allele">): string {
  return [data.subtitleLabel, data.allele ? "Allele" : "Gene"].filter(Boolean).join(" - ");
}
