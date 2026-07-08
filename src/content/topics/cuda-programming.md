---
title: "CUDA Programming"
summary: "Programming NVIDIA GPUs directly: the execution model, the memory hierarchy, and how to write and launch kernels."
status: "Exploring"
updated: "2026-07-06"
tags: ["systems", "gpu", "performance"]
---

CUDA is NVIDIA's platform for general-purpose GPU programming. It exposes thousands of parallel threads and an explicit memory hierarchy, so learning it means learning to think in terms of massive data parallelism.

## Why I'm digging in

- GPUs are the engine behind modern ML, and CUDA is the layer most of that performance is built on.
- It is the foundation under kernel engineering: to optimize kernels I need the execution and memory model in my bones.

## What I want to understand

- The execution model: grids, blocks, warps, and threads, and how they map onto the hardware.
- The memory hierarchy: global, shared, and registers, and why coalesced access and shared memory matter so much.
- Writing, launching, and synchronizing a kernel, and reasoning about occupancy.
- Where the libraries (cuBLAS, cuDNN, CUTLASS) fit versus a hand-written kernel.

## Starting points

- The CUDA C++ Programming Guide, and the classic vector-add then tiled-matmul progression.
- NVIDIA's "An Even Easier Introduction to CUDA."
- Nsight Compute for profiling a kernel.

## Notes

- 2026-07-06: Plan is the standard path: vector add, then a tiled matrix multiply using shared memory, profiling each step to feel the memory hierarchy.
