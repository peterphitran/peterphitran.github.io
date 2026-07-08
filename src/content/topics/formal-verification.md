---
title: "Formal Verification"
summary: "Proving software and hardware correct against a specification, instead of only testing for bugs."
status: "Exploring"
updated: "2026-07-06"
tags: ["theory", "systems", "safety"]
---

Formal verification uses mathematics to prove that a system meets a precise specification, rather than sampling for bugs the way tests do. Testing can show the presence of bugs; proofs aim to show their absence.

## Why I'm digging in

- Tests only cover the cases you think of. A proof covers every case inside the model.
- It underpins high-assurance software (avionics, cryptography, kernels), and it is increasingly interesting for AI safety, where we want guarantees about behavior rather than vibes.

## What I want to understand

- The proof-assistant workflow: writing specifications and machine-checked proofs in Lean, Coq, or Isabelle.
- Where SMT solvers (Z3) and model checkers (TLA+) fit versus interactive proof.
- What can realistically be verified, and the true cost of doing it.
- Whether any of this transfers to reasoning about ML systems.

## Starting points

- Lean 4, with "Mathematics in Lean" and the Natural Number Game as an on-ramp.
- TLA+ for specifying concurrent and distributed systems.
- seL4, the formally verified microkernel, as a real proof at scale.
- CompCert, a verified C compiler.

## Notes

