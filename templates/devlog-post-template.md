---
title: Devlog Template
description: Template for starting a new developer log.
date: 2026-09-11
banner:
bannerAlt: Place alt text for broken images and OSRs.
tags:
  - tag1
  - tag2
---

# [Specific Technical Title, e.g., Setting up Sol2 Bindings for the ECS]

*Tip: Keep the title hyper-specific to the system you worked on.*

## The Goal
[1-2 sentences explaining what you set out to achieve. E.g., "I needed a way to script entity behaviors without recompiling the core C++20 engine."]

## The Constraints & Setup
[Detail the environment or limitations. Mention the libraries involved, such as managing dependencies through vcpkg or linking against SDL3.]

## Implementation
[Break down the solution. Focus on the 'how' and 'why'.]

```cpp
// Insert a concise, relevant code snippet. 
// Show the specific integration point, not the boilerplate.
```

[Explain the critical parts of the code. If you hit a snag—like a nasty CMake linking error or an issue with your spdlog setup—document how you fixed it.]

## The Result
[Show the outcome. If it has a visual component, add a screenshot of the ImGui debug window or a short GIF. If it's backend, share a log output or a performance metric.]

---
*Tip: Review before publishing to ensure it covers only one core concept. Keep it modular.*
