---
title: "Mechanistic Interpretability & Goodfire.ai"
summary: "Reverse-engineering what neural networks actually compute, and the tooling (like Goodfire) that makes internals inspectable and steerable."
status: "Exploring"
updated: "2026-07-06"
tags: ["ml", "interpretability", "safety"]
---

Mechanistic interpretability tries to reverse-engineer trained networks into human-understandable pieces: features, circuits, and the algorithms they implement. The goal is to explain a model's behavior from its internals, not just its outputs.

## Why I'm digging in

- It is one of the few paths toward genuinely understanding these models, not just using them.
- It has direct safety value: if you can read and edit internal features, you can detect and steer behavior.
- Goodfire.ai is building interpretability into a usable product (feature inspection and steering), a rare bridge from research to tooling.

## What I want to understand

- Features and circuits, and the superposition problem (why single neurons end up polysemantic).
- Sparse autoencoders (SAEs) as a way to pull interpretable features out of activations.
- Activation steering: changing behavior by editing features instead of retraining.
- What Goodfire's approach (such as their Ember API) exposes, and how people use it in practice.

## Starting points

- Anthropic's "Toy Models of Superposition" and their sparse-autoencoder / dictionary-learning work.
- Neel Nanda's TransformerLens and interpretability tutorials.
- Goodfire.ai's research posts and API docs.

## Notes

- 2026-07-06: First goal is to internalize superposition and SAEs conceptually, then try steering a small model through its features.
