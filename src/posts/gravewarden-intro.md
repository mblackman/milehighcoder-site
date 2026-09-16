---
title: First! Building Gravewarden on Octarine Engine
description: An introductory post outlining how I built a game prototype on my custom-built engine.
date: 2026-09-11
banner:
bannerAlt: Place alt text for broken images and OSRs.
noindex: true
tags:
  - software
  - game-dev
  - gravewarden
---

## The Goal
[1-2 sentences explaining what you set out to achieve. E.g., "I needed a way to script entity behaviors without recompiling the core C++20 engine."]

This is Gravewarden (working title), a vampire survivors-like game I'm building. It is built on my homemade 2D ECS game engine, Octarine Engine, which I made to learn more about game engines. 

## The Constraints & Setup
[Detail the environment or limitations. Mention the libraries involved, such as managing dependencies through vcpkg or linking against SDL3.]

You may be wondering what a 2D ECS game engine is, and we won't be going into the details in this post today, but expect a future post detailing this concept and how Octarine Engine approaches this idea.

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

---

## Post Outline: "Hello World: Building [Prototype Name] in Octarine Engine"

**1. The Hook: Introduce the Prototype**
Start with a GIF of the game running. Give a strict 2-3 sentence elevator pitch of the gameplay. What is the core loop?

* *Example:* "This is [Game Name], a 2D [Genre] I'm building. To get the specific feel I wanted for the mechanics, I built a custom C++20 backend called Octarine Engine."

**2. The Architecture by Example**
Instead of listing features, trace a single frame or action through your stack to show how the game and engine interact.

* **Input & Windowing:** Briefly explain how you handle a player action. Show a tiny snippet of how SDL3 captures the input and passes it to your simulation layer.
* **Game Logic & Scripting:** This is where you highlight your workflow. Explain how you separated the engine code from the game rules. If you are using Sol2 to bind Lua scripts for rapid gameplay iteration, show a basic example of how the prototype's logic calls the C++ backend.
* **Math & Rendering:** Describe how that logic translates to the screen, touching on how you use GLM for your 2D coordinate spaces and transformations.

**3. The Developer Experience (Tooling)**
Engineers love seeing how other engineers work. Show a screenshot of the prototype running with your ImGui debug windows open.

* Briefly explain how integrating ImGui alongside spdlog allows you to tweak prototype variables (like physics or rendering states) in real-time without recompiling the core engine.

**4. The Road Ahead**
Conclude by stating what is next for the prototype. This sets up your next devlog post.

* *Example:* "The basic movement and rendering are stable, but next week I'll be detailing how I'm handling asset management and dependency loading using vcpkg."

---

Since this approach relies heavily on connecting the technical systems to the game itself, what is the core gameplay mechanic of the prototype you plan to showcase?