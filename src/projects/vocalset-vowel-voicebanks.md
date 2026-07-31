---
title: VocalSet Vowel Voicebanks
subdir: Project
repo: https://github.com/mblackman/vocalset-vowel-voicebanks
demo: https://mblackman.github.io/vocalset-vowel-voicebanks/
description: Short, game-ready vowel clips (a e i o u) for 20 singers, derived from the VocalSet dataset.
date: 2026-07-09
endDate: 2026-07-09
type: personal-project
tech:
    - Python
    - Audio Engineering
    - Asset Generation
---

A utility and dataset of short, game-ready vowel clips (a, e, i, o, u) generated from 20 different singers, derived from the academic VocalSet dataset. It provides a dependency-free build script and an interactive browser preview to help game developers implement character "voices" (such as the babble or blips heard in dialogue systems like Animal Crossing).

This project highlights my ability to work with and parse large datasets into highly optimized, usable game assets. 

## Features

- **Game-Ready Audio:** Extracts perfectly cut vowel sounds from the VocalSet dataset, making them ready to drop right into a game engine.
- **Python Build Script:** Contains a dependency-free Python script (`make_voicebanks.py`) to process the raw audio. It handles micro-fading in and out, loudness normalization (Peak and RMS target matching), and resampling on the fly.
- **Interactive Web Preview:** An included web preview allows developers to easily test the generated audio files before integrating them into a project.
- **Customizable Generation:** Can be scripted to only generate specific vowel subsets, apply different normalizations, or target specific voice groups (e.g., female vs male).
