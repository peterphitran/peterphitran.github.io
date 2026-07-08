---
title: "Open Source Models"
summary: "Openly available model weights (Llama, Mistral, Qwen, Gemma, DeepSeek) and the licenses and ecosystems around them."
status: "Exploring"
updated: "2026-07-08"
tags: ["ml", "llms", "ecosystem"]
---

Open models ship their weights publicly, so you can run, inspect, finetune, and deploy them yourself instead of calling a closed API.

## Why I'm digging in

- They make local, private, and customizable AI possible, which ties directly into my edge and finetuning interests.
- The gap to closed models keeps narrowing, and the ecosystem moves fast.

## What I want to understand

- The real license landscape: genuinely open (Apache/MIT) versus "open weight" with usage restrictions, and what that means for building on them.
- The main families (Llama, Mistral and Mixtral, Qwen, Gemma, DeepSeek) and their tradeoffs.
- How open models are distributed and run (Hugging Face, GGUF, Ollama).
- Where open models truly match closed ones, and where they still trail.

## Model routing

With many models available, you rarely want to send every request to the same one. Routing is the logic that picks the right model for each job, and it shows up at two levels:

- **System-level routing.** Choose a model or provider per request based on cost, latency, context length, or capability: a small cheap model handles the easy queries, a larger one handles the hard ones. This is exactly what a system like Nous does when it routes a task to the right backend.
- **Mixture-of-Experts routing.** Inside a sparse model, a small gate network sends each token to just a few expert subnetworks, so the model can hold many parameters while only activating a fraction of them per token.

What I want to understand is how routers actually decide (fixed heuristics, a learned classifier, or a cheap model judging difficulty), and how to tell whether a router saves real cost without quietly hurting quality.

## Starting points

- The Hugging Face model hub and open LLM leaderboards.
- Ollama for running open models locally with one command.
- Reading the actual license for each family, not just the label.

## Notes

- 2026-07-06: Want to build a small comparison of a few open models on the same tasks I care about, run locally.
