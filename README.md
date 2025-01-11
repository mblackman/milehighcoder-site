# milehighcoder-site

This is the repository for my personal site: [milehighcoder.com](https://www.milehighcoder.com). It's based of the template [nulite](https://github.com/codingpotions/nulite) with a couple of changes.

## Features

- 🧐 Simple. Elegant, minimalist design, clear and easy to read.
- 📈 Good performance. Inline styles and the minimum amount of JS to make the page load as fast as possible.
- 🌙 Support for light/dark mode. Respects user tastes and allows toggle between both saving preferences.
- 📡 RSS. Bring back old days.
- 🎨 Easily customizable. Implements both Tailwindcss and Daisy UI for beautiful and rich pages.
- 🖍️ Syntax coloring. If you write blocks of code in the articles you will have coloring.
- 📝 Article recommendation. Each article has a tag-based recommendation system to give the user more content to read.

## Running and serving a dev build

```sh
npm run start
```

Browse to [http://localhost:8080](http://localhost:8080).

## Running and serving a prod build

```sh
npm run build
```

Output files are generated into the `_site` folder.

## Project structure

```
public/
    This folder contains statics files, copied directly into the output, like the favicon, for example
src/
  _includes/
    All UI partials. Inside the css folder, in the global.liquid you can change the CSS variables
  _data/
    Here you can change the site info, like the title and description
  posts/
    Each individual post in markdown files
  projects/
    The projects to show off your work
  utils/
    Utility pages for important information

Configuration and build files
```
