---
title: "Diffusion Models"
summary: "Generative models that create data by learning to reverse a gradual noising process, behind most modern image generation and now text."
status: "Exploring"
updated: "2026-07-06"
tags: ["ml", "generative", "theory"]
---

Diffusion models generate data by starting from noise and denoising it step by step. Training teaches the model to reverse a process that slowly adds noise to real data, so sampling walks that process backward, from pure noise to a coherent result.

## Why I'm digging in

- They are the engine behind modern image, audio, and video generation, and the underlying math is genuinely elegant.
- Diffusion is now being applied to text (diffusion language models), a fascinating alternative to autoregressive generation.

## What I want to understand

- The forward and reverse process, and the intuition behind score matching.
- DDPM versus DDIM sampling, and why latent diffusion (Stable Diffusion) made it practical.
- Classifier-free guidance, and how conditioning (text to image) actually works.
- How diffusion for text compares to autoregressive LLMs.

## Starting points

- The DDPM paper (Ho et al.) and Lilian Weng's "What are Diffusion Models?" write-up.
- The latent diffusion / Stable Diffusion paper.
- Hugging Face `diffusers` to run and take apart a pipeline.

## Notes

