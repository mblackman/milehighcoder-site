---
title: Swarley.club
subdir: Project
repo: https://github.com/mblackman/swarley-club
description: My official fan site of my number 1 dog
splash: /images/projects/swarley-club-splash.png
date: 2025-03-31
endDate: 2025-04-20
type: personal-project
tech:
    - HTML/CSS/Javascript
---

<https://swarley.club>

A static HTML page with backend services counts the number of people who have signed up for the club (please sign up; it's free!). This site utilizes Cloudflare Workers to provide backend services that allow for a real-time count of registered users and client tracking to ensure unique counting.

## Features

- **Automated Continuous Deployment**: Changes made on GitHub are automatically tracked, and cloud builds deploy both Cloudflare Pages and Workers directly from the repository.
- **D1 Database**: The Cloudflare D1 database is used to track the unique members of the Swarley club.
- **Dog**: Just take a look at him.

![Swarley closeup](/images/projects/swarley-10.jpg)
