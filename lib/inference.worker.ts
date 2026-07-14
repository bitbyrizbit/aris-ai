/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;
export {};

import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;

let summarizer: any = null;

async function getSummarizer() {
  if (!summarizer) {
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-6-6");
  }
  return summarizer;
}

self.onmessage = async (event: MessageEvent) => {
  const { type, id, text } = event.data;

  if (type === "load") {
    try {
      await getSummarizer();
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "error", id, message: (err as Error).message });
    }
    return;
  }

  if (type === "summarize") {
    try {
      const model = await getSummarizer();
      const output = await model(text, {
        max_new_tokens: 80,
        min_new_tokens: 20,
        num_beams: 1,
        do_sample: false,
        early_stopping: true,
      });
      const summary = Array.isArray(output) ? output[0].summary_text : output.summary_text;
      self.postMessage({ type: "result", id, summary });
    } catch (err) {
      self.postMessage({ type: "error", id, message: (err as Error).message });
    }
  }
};