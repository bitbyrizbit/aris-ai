# Technical report

The numbers behind the claims — and an honest account of which numbers we don't have yet.

---

## Model and runtime

| | |
|---|---|
| Model | `Xenova/distilbart-cnn-6-6` — a distilled BART model fine-tuned for summarization |
| Format | ONNX |
| Runtime | [Transformers.js](https://huggingface.co/docs/transformers.js) v2, ONNX Runtime Web, WASM backend |
| Quantization | int8 — the default quantized weights Transformers.js serves for browser use; no additional quantization applied on top |
| Model size | ~90–150MB as downloaded (not independently re-measured for this report) |
| Decoding | Greedy — `num_beams: 1`, `max_new_tokens: 80`, `min_new_tokens: 20` |

## Performance — observed, not benchmarked

This is a real gap, stated directly rather than papered over with invented precision.

- **Compute:** CPU only, via WASM. No GPU or NPU acceleration.
- **Observed latency:** roughly two minutes end-to-end (model already cached) for a ~600-word document split across two devices, convergence pass included. Measured on one mid-range Windows laptop and one mid-range Android phone over the same wifi network.
- **Peak memory:** not measured. Would be the first thing added with more time.
- **Device matrix:** one laptop, one phone. No testing across low-end hardware, older browsers, or Safari specifically.

None of the above is a rigorous benchmark. It's what we watched happen, twice, and wrote down honestly.

## What runs on-device, what doesn't

**Fully on-device, no exceptions:** chunking, every summarization pass, the final convergence. This data leaves a device only across a direct P2P channel to another device the user explicitly approved — never to a server.

**Requires a network:** the one-time WebRTC handshake between two devices, and the one-time model download on first use (served from Hugging Face's CDN, cached by the browser afterward).

**What leaves the device:** nothing but the chunks and summaries sent directly, peer-to-peer, to devices already inside an approved session. No telemetry, no analytics, no logging beyond the browser's own console.

## Evaluation

No formal benchmark against a reference summarization dataset — worth naming outright as the biggest evaluation gap here. What was actually tested:

- **Narrative prose** — a five-paragraph account of the discovery of penicillin — produced coherent, accurate summaries, per-device and converged, across repeated runs.
- **A known, reproduced failure case** — feeding the pipeline a structured HR form (colon-separated fields, no narrative flow) produced fluent-sounding but factually empty output. The model latched onto a high-frequency repeated name and wove it into grammatically valid, meaningless sentences. This is a documented ceiling of summarization models trained on news-style prose, not a bug in the application layer — and it's called out plainly in the main README rather than quietly avoided in the demo.

## Privacy and safety

- **Data handling:** documents and summaries live in browser memory and, briefly, in a P2P channel between approved devices. Nothing touches a disk, a database, or a server.
- **What persists:** only a device's own room code and the last room joined, in `sessionStorage`, gone when the tab session ends. No document content is ever stored.
- **Permissions:** camera access, requested only when a user taps "Scan QR," used solely to read a QR code client-side. Nothing captured is ever transmitted.
- **Where the gate is thin:** host approval is the only access control. No identity verification sits behind it, and no encryption layer is added beyond what WebRTC provides on its own.

## Attribution

- [Transformers.js](https://huggingface.co/docs/transformers.js) (Xenova) — in-browser model runtime
- [Xenova/distilbart-cnn-6-6](https://huggingface.co/Xenova/distilbart-cnn-6-6) — summarization model
- [PeerJS](https://peerjs.com/) — WebRTC client and self-hosted signaling server (`peer` npm package)
- [Next.js](https://nextjs.org/) — application framework
- [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / [drei](https://github.com/pmndrs/drei) — the 3D connection map
- [Framer Motion](https://www.framer.com/motion/) — scroll-driven animation
- [qrcode.react](https://github.com/zpao/qrcode.react) — QR generation
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) — QR scanning
- Fonts, via Google Fonts: Bricolage Grotesque, Instrument Serif, Inter, JetBrains Mono
- Hosting: [Vercel](https://vercel.com) (app), [Render](https://render.com) (signaling relay)
