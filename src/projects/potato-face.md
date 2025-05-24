---
title: Potato Face 2D Game Engine
subdir: Project
repo: https://github.com/mblackman/potato-face
description: A mini 2D game engine project to learn more about how game engines work.
splash: /images/projects/potato-face-splash.png
date: 2024-05-20
endDate: 2025-05-17
type: personal-project
visible: true
tech:
    - C++
    - Make
    - SDL
    - Lua
---

This is a bite-sized 2D game engine that I developed from the ground up to enhance my understanding of how game engines work. The engine takes a simple approach while incorporating modern industry concepts, such as an Entity-Component-System (ECS) for efficient entity management. This project marks the beginning of my journey into game engine development, with the aim of eventually creating a more sophisticated engine for a future game project.

Using this game engine, I created a small prototype to test various systems such as health tracking, sprite rendering, keyboard controls, and more. Please note that this iteration of the game engine is not designed for building full games but serves as a demonstration of concepts like ECS and working with SDL.

## Features

- Integrates several third-party libraries for diverse functionalities:
  - **GLM:** A math library primarily used for vector operations.
  - **ImGUI:** A highly portable immediate GUI library, ideal for building editor tools.
  - **Lua:** A lightweight scripting language built in C that allows for game configuration and logic scripting.
  - **SDL2:** A cross-platform development layer designed for building programs with audio, visual, and input capabilities.
  - **spdlog:** A lightweight logging library for C++.
- An ECS for managing entities, components, and systems in a cohesive manner. This framework supports various systems within the game engine, including player control, graphical rendering, and movement.
- An event bus system that facilitates communication of events and data between different systems in the ECS, promoting decoupling of features.
- Examples of C++ and Lua integration, demonstrating how a scripting language can be effectively utilized to develop game logic that is enhanced by an efficient ECS implemented in C++.
