export function getDefaultBlockLabel(data: {
  datasetLabel?: string;
  allele: boolean;
  isSingleCell: boolean;
  chainLabel?: string;
}) {
  const parts: string[] = [];

  // Add dataset name
  if (data.datasetLabel) {
    parts.push(data.datasetLabel);
  }

  // Add allele/gene
  parts.push(data.allele ? 'Allele' : 'Gene');

  // Add chain info for single-cell datasets
  if (data.isSingleCell && data.chainLabel) {
    parts.push(data.chainLabel);
  }

  return parts.join(' - ');
}
