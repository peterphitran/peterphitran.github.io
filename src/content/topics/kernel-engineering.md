---
title: "Kernel Engineering"
summary: "Writing and optimizing the small, hot compute kernels (often on GPUs) that make ML and numerical workloads fast."
status: "Exploring"
updated: "2026-07-06"
tags: ["systems", "ml", "performance"]
---

Kernel engineering is the craft of writing the small pieces of code that do the heavy numerical work, and squeezing the most performance out of the hardware they run on. In ML, these are the matmul, attention, and normalization kernels that dominate runtime.

## Why I'm digging in

- It is where ML performance is actually won or lost, and it connects my interest in edge models and inference optimization down to the metal.
- Understanding kernels demystifies why something like FlashAttention or a good quantized kernel is such a large win.

## What I want to understand

- The mental model of a kernel: what runs per element, how work is tiled, and why memory movement so often dominates.
- Memory-bound versus compute-bound, and roofline analysis for deciding what is even worth optimizing.
- Kernel fusion, and why fewer trips to memory beats raw FLOPs so often.
- Higher-level kernel languages like Triton, and how they compare to hand-written CUDA.

## Starting points

- Triton and its tutorials, as an approachable way to write fused GPU kernels.
- The FlashAttention papers as a case study in memory-aware kernel design.
- Profilers (Nsight Compute, the PyTorch profiler) to see where time actually goes.

## Notes

- 2026-07-06: Goal is to write a simple fused kernel in Triton and measure it against the naive version, then read FlashAttention with that context in hand.
