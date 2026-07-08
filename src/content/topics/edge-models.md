---
title: "Edge Models"
summary: "Running models on-device (phones, laptops, embedded) under tight memory, latency, and power budgets."
status: "Exploring"
updated: "2026-07-08"
tags: ["ml", "systems", "local"]
---

Edge models run inference on the device itself instead of a datacenter, trading some raw capability for privacy, latency, offline use, and cost.

## Why I'm digging in

- Local-first is appealing: no round trip, no data leaving the device, works offline.
- It connects hardware, quantization, and runtime engineering, which is the systems side of ML I enjoy.

## What I want to understand

- Quantization (8-bit, 4-bit, and lower) and how much quality you actually give up.
- Distillation and pruning as ways to shrink a model.
- The runtime landscape: llama.cpp and GGUF, ONNX Runtime, Core ML, TFLite, and hardware accelerators (NPUs).
- How to reason about the memory, latency, and battery budget on a real device.

## The inference pipeline

Running a model is a small pipeline, and knowing its stages is what makes a latency or memory budget legible:

- **Tokenize.** Turn the input text into the token ids the model actually consumes.
- **Prefill.** Push the whole prompt through once to build the KV cache (the saved attention state for every token so far). This stage is compute-bound.
- **Decode.** Generate the output one token at a time, reusing the KV cache so each step only processes the newest token. This stage is memory-bound, which is why it usually dominates on constrained hardware.
- **Detokenize and stream.** Turn the ids back into text, normally streamed as they are produced.

The two numbers that fall out of this are time-to-first-token (set mostly by prefill) and tokens per second (set mostly by decode). On an edge device, the KV cache size and the available memory bandwidth often decide whether a model is usable at all.

## Starting points

- llama.cpp and the GGUF format for local LLMs.
- ONNX Runtime for cross-platform deployment.
- Apple Core ML and the Neural Engine for on-device inference.

## Notes

