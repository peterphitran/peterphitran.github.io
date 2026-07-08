---
title: "Edge Models"
summary: "Running models on-device (phones, laptops, embedded) under tight memory, latency, and power budgets."
status: "Exploring"
updated: "2026-07-06"
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

## Starting points

- llama.cpp and the GGUF format for local LLMs.
- ONNX Runtime for cross-platform deployment.
- Apple Core ML and the Neural Engine for on-device inference.

## Notes

