---
title: "Episode: Reality Stars"
subdir: Project
description: A storytelling mobile game about being an active character in a reality tv show.
splash: /images/projects/hot-in-hollywood-splash.png
date: 2023-04-01
activeDevelopment: true
type: professional-project
hidden: false
tech:
    - Unity
    - C#
    - Naninovel
    - UniTask
    - DoTween
---

**Episode: Reality Stars** is a mobile game for iOS and Android that puts players in the shoes of a humble girl's journey into the world of reality TV in this RPG storytelling game. This game focuses on well-written stories interlaced with RPG collection and leveling mechanics to create a unique experience where players get to actively respond to stories.

## Technical Highlights

Developing a narrative-heavy RPG required a robust architecture capable of blending visual novel mechanics with collection and pacing systems. The game was built in **Unity** using **C#**, leveraging several powerful frameworks and engineering practices to ensure a smooth, maintainable project:

*   **Naninovel:** Integrated as the core driver for the game's extensive storytelling components. This framework handled the massive volume of writing, branching narrative nodes, and character sprite scripting.
*   **DoTween:** Utilized heavily to implement highly polished UI animations, engaging screen transitions, and to maximize overall "game feel" within the RPG and visual novel segments.
*   **UniTask:** Provided an efficient, zero-allocation async/await structure. This was critical for handling asynchronous operations—such as loading heavy dialogue assets and server communications—without causing frame drops or stuttering during gameplay. 
*   **Custom Internal Tools:** To manage the massive scale of a live-ops narrative game, our engineering team developed custom Unity tools. These pipelines empowered the writing and design teams to rapidly author, import, validate, and test story content directly inside the engine. Along with tooling to aid in delivering content to players and persisting their state between sessions and devices.

### Available Now
*   [Apple App Store](https://apps.apple.com/us/app/episode-reality-stars/id1604253094)
*   [Google Play Store](https://play.google.com/store/search?q=episode+reality+stars&c=apps)
