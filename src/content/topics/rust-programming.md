---
title: "Rust Programming"
summary: "A systems language that guarantees memory safety without a garbage collector, through ownership and borrowing."
status: "Exploring"
updated: "2026-07-06"
tags: ["systems", "languages"]
---

Rust is a systems programming language that gives you low-level control and high performance while preventing whole classes of memory bugs at compile time, and it does this without a garbage collector.

## Why I'm digging in

- It offers the performance and control of C or C++ with memory safety enforced by the compiler, which is a genuinely new tradeoff rather than a small improvement.
- It is increasingly the language of modern infrastructure and ML tooling (tokenizers, candle, burn), so it pairs naturally with my systems and ML interests.

## What I want to understand

- Ownership, borrowing, and lifetimes, and how the borrow checker actually reasons about them.
- Why "fearless concurrency" falls out of the same rules that guarantee memory safety.
- Traits, enums, and pattern matching as the core of Rust's expressiveness.
- The ecosystem: cargo as the build and package tool, and where Rust shows up in ML and WebAssembly.

## Starting points

- "The Rust Programming Language" (the Book) and the Rustlings exercises.
- Building a small CLI with cargo to get the everyday workflow.
- Rewriting something I would normally write in C, and letting the compiler teach me.

## Notes

