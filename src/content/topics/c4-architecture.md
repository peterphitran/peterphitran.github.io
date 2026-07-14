---
title: "C4 Architecture"
summary: "A lightweight model for visualizing software architecture at four zoom levels — Context, Containers, Components, and Code — so diagrams stay consistent and easy to follow."
status: "Exploring"
updated: "2026-07-08"
tags: ["architecture", "systems", "documentation"]
---

The C4 model is a simple way to describe and diagram software architecture using a set of nested "maps" at increasing levels of detail: System Context, Containers, Components, and Code. The point is to give every diagram a clear scope and audience instead of one tangled picture that tries to show everything.

## Why I'm digging in

- It brings order to architecture diagrams: a shared notation and a fixed set of abstractions mean a diagram communicates the same thing to everyone who reads it.
- The zoom-in idea (from a whole system down to individual components) matches how I actually reason about systems, and it pairs well with my systems and documentation interests.

## What I want to understand

- The four levels and when each one is worth drawing: Context and Container almost always, Component sometimes, Code rarely.
- The core abstractions — person, software system, container, component — and how to keep them consistent across diagrams.
- Supplementary diagrams (system landscape, deployment, dynamic) and where they add value.
- "Diagrams as code" workflows so architecture lives next to the source and stays current.

## Starting points

- Simon Brown's c4model.com and his "Visualising software architecture" writing.
- Structurizr for authoring C4 from a DSL, and the C4-PlantUML and Mermaid C4 support for text-based diagrams.
- Taking one system I already know well and drawing its Context and Container diagrams to feel the model in practice.

## Notes

- 2026-07-08: Want to try generating Context and Container diagrams as code (Mermaid or Structurizr DSL) and keep them in the repo so they update alongside the system they describe.
