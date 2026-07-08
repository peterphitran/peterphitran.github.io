---
title: "Browser Automation"
summary: "Driving a real web browser programmatically for testing, scraping, and increasingly for AI agents that navigate the web."
status: "Exploring"
updated: "2026-07-06"
tags: ["systems", "testing", "agents"]
---

Browser automation controls a real browser through code: navigating pages, clicking, typing, waiting for content, and reading the DOM (Document Object Model), without a human driving it.

## Why I'm digging in

- It powers end-to-end testing, scraping, and workflow automation, and it is now the substrate for AI agents that use the web the way a person does.
- It connects directly to the headless idea from the Nous write-up

## What I want to understand

- The main engines (Playwright, Puppeteer, Selenium) and where each one fits.
- The Chrome DevTools Protocol (CDP) underneath, and how a headless Chromium is actually driven.
- Robust selectors and waiting strategies, since timing and flakiness are the hard part of reliable automation.
- The new wave of AI-driven browser agents (computer use, browser-use) and how they turn a goal into concrete clicks and keystrokes.

## Starting points

- Playwright, especially its auto-waiting model and trace viewer.
- The Chrome DevTools Protocol as the layer most tools build on.
- Browser-agent projects that let an LLM drive a page toward a goal.

## Notes

- 2026-07-06: I want to understand auto-waiting and selector robustness deeply, then try an LLM-driven agent that completes a small web task start to finish.
