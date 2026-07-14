export function buildMergePrompt(summaries: string[]): string {
  return summaries
    .filter((s) => s.trim().length > 0)
    .map((s, i) => `Section ${i + 1}: ${s.trim()}`)
    .join(" ");
}

export function isReadyToMerge(
  results: { status: string; summary?: string }[]
): boolean {
  return results.length > 0 && results.every((r) => r.status === "done" && !!r.summary);
}