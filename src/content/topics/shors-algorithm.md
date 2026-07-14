---
title: "Shor's Algorithm"
summary: "A quantum algorithm that factors large integers in polynomial time, threatening the RSA encryption that secures much of the internet."
status: "Exploring"
updated: "2026-07-08"
tags: ["quantum", "cryptography"]
---

Shor's algorithm is a quantum algorithm that factors large integers exponentially faster than the best known classical methods. That matters because the hardness of factoring is what keeps RSA encryption secure.

## Why I'm digging in

- It's the clearest example of quantum computing beating classical computing on a problem people actually care about.
- It's the reason post-quantum cryptography exists, which ties into my interest in security and systems.

## What I want to understand

- The core idea: turning factoring into a period-finding problem and solving that with the quantum Fourier transform.
- What "polynomial time" buys you here versus classical factoring.
- Why it needs a large, error-corrected quantum computer that doesn't exist yet.

## Starting points

- A plain-English walkthrough of the period-finding reduction.
- Running the toy version in Qiskit to factor a small number like 15.

## Notes

- 2026-07-08: Want to trace how period finding leads to a factor, without getting lost in the linear algebra.
