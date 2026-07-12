export function chunkText(text: string, parts: number): string[] {
  const trimmed = text.trim();
  if (parts <= 1 || trimmed.length === 0) return [trimmed];

  const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
  const chunks: string[] = Array.from({ length: parts }, () => "");
  const perChunk = Math.ceil(sentences.length / parts);

  sentences.forEach((sentence, i) => {
    const idx = Math.min(Math.floor(i / perChunk), parts - 1);
    chunks[idx] += sentence;
  });

  return chunks.filter((c) => c.trim().length > 0);
}