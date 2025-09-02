---
title: Octarine Engine
description: A tiny 2D game engine powered by an archetype ECS
subdir: Project
repo: https://github.com/mblackman/Octarine-Engine
splash: /images/projects/Pasted image 20250527110616.png
activeDevelopment: true
date: 2025-00-24
type: personal-project
hidden: false
tech:
  - C++
  - CMake
  - SDL3
  - Lua
---
This is a bite-sized 2D game engine that I developed from the ground up to enhance my understanding of how game engines work. The engine adopts a modern approach, incorporating contemporary industry concepts, such as a data-oriented, archetype-based Entity-Component-System (ECS) for highly efficient entity management. This project marks the beginning of my journey into game engine development, to eventually create a more sophisticated engine for a future game project.

Using this game engine, I created a small prototype to test various systems such as health tracking, sprite rendering, keyboard controls, and more. Please note that this iteration of the game engine is not designed for building full games but serves as a demonstration of a high-performance ECS and the integration of C++ with a scripting language like Lua.

## Features

*   Integrates several powerful third-party libraries:
    
    *   **SDL3:** A cross-platform development layer providing low-level access to audio, keyboard, mouse, joystick, and graphics hardware.
        
    *   **GLM:** A math library primarily used for vector and matrix operations, essential for 2D transformations.
        
    *   **ImGui:** A highly portable immediate-mode GUI library, ideal for building editor and debug tools.
        
    *   **sol:** A powerful and easy-to-use C++ library binding for Lua, enabling flexible scripting capabilities.
        
    *   **spdlog:** A lightweight and fast logging library for C++.
        
*   A high-performance, archetype-based **Entity-Component-System (ECS)**. This modern architecture groups entities with the same component layout into memory-contiguous chunks, allowing for extremely fast iteration and processing of game systems.
    
*   A flexible **event bus system** that enables decoupled communication between different parts of the engine, allowing systems to react to events without being directly coupled.
    
*   Deep integration between **C++ and Lua**, demonstrating how a high-performance C++ backend can be scripted with a lightweight language. This allows for defining entities, components, and game logic directly in Lua files for rapid development and iteration.