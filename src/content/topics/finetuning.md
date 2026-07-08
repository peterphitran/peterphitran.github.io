---
title: "Finetuning"
summary: "Adapting a pretrained model to a specific task or domain, from full finetuning to lightweight LoRA."
status: "Exploring"
updated: "2026-07-06"
tags: ["ml", "llms", "training"]
---

Finetuning takes a model that already learned general patterns and nudges it toward a narrower task, domain, or style using a smaller, targeted dataset.

## Why I'm digging in

- It is the most direct way to make a general model behave the way a specific product needs.
- Parameter-efficient methods (LoRA, QLoRA) make it approachable on modest hardware, which fits my interest in local and edge setups.

## What I want to understand

- When to finetune versus retrieval (RAG) versus just better prompting. They solve different problems.
- How LoRA and QLoRA actually work, and why they are so much cheaper than full finetuning.
- The tuning stack: supervised finetuning, then preference methods like DPO or RLHF, and what each one buys you.
- Data quality, catastrophic forgetting, and how to evaluate a finetune honestly.

## Starting points

- Hugging Face `transformers` plus `peft` for LoRA.
- The QLoRA paper for the quantized-adapter idea.
- DPO as a simpler alternative to RLHF.
- Small, clean datasets first. The data matters more than the method.

## Notes

- 2026-07-06: Plan is a LoRA finetune of a small open model on a narrow task, tracking whether it improves the target without wrecking general ability.
