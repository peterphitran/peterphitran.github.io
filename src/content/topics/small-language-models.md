---
title: "Small Language Models"
summary: "Compact language models (often a few billion parameters or fewer) that trade scale for speed, low cost, and on-device use, while staying surprisingly capable."
status: "Exploring"
updated: "2026-07-08"
tags: ["ml", "llms", "local"]
---

Small language models (SLMs) are compact LLMs, often in the range of a few billion parameters or fewer, built to run cheaply and even on-device while staying useful for real work. The interesting shift is how capable they have become for their size.

## Why I'm digging in

- They make local, private, and cheap AI practical, and they pair directly with my edge-models and finetuning interests.
- The frontier is no longer only "bigger is better." A well-trained small model on a focused task can beat a giant one on cost and latency, and sometimes on quality.

## What I want to understand

- What actually makes a small model good: high-quality and synthetic training data, distillation from larger models, and careful curation over raw scale.
- The capability tradeoffs: where SLMs hold up (focused tasks, structured output, tool calling) and where they fall short (broad reasoning, long context).
- How they fit into agent systems as fast, cheap workers operating under a larger model's supervision.
- The main families to track (Phi, Gemma, Qwen, Llama 3.2 small, SmolLM) and how their sizes compare.

## Starting points

- Microsoft's Phi models and the "textbooks are all you need" data-quality argument.
- Hugging Face SmolLM and its open training-data recipe.
- Running a 1B to 3B model locally to feel both the speed and the limits firsthand.

## Notes

- 2026-07-08: Want to take one small model and push it hard on a single narrow task with a good prompt and a light finetune, then compare it to a large model on cost and quality.
