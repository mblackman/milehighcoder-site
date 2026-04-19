# milehighcoder-site

Source for my personal site: [milehighcoder.com](https://www.milehighcoder.com). Built with [Eleventy](https://www.11ty.dev/) v3, Liquid templates, Tailwind CSS, and DaisyUI. Originally forked from the [nulite](https://github.com/codingpotions/nulite) template, since customized.

## Features

- Minimal, content-first design.
- Inline-critical CSS for fast first paint (Tailwind output is minified and embedded into the `<style>` tag at build time).
- Light/dark themes via DaisyUI (`retro` / `night`), with a user-toggle that persists the preference.
- RSS feed.
- Syntax highlighting for code blocks.
- Tag-based related-posts recommendations.
- Content editing through [Pages CMS](https://pagescms.org) (see [.pages.yml](.pages.yml)).

## Development

Install dependencies once:

```sh
npm install
```

Run the dev server (starts Eleventy serve and the Tailwind watcher concurrently):

```sh
npm run start
```

Open <http://localhost:8080>.

> The Tailwind build runs as a separate process from Eleventy. A Liquid shortcode inlines `_site/output.css` into every page, so if the Tailwind watcher is not running, pages will have stale or missing styles. Always use `npm run start` during development rather than invoking `eleventy --serve` directly.

Production build:

```sh
npm run build
```

Output is written to `_site/`.

Debug variants:

```sh
npm run debug         # DEBUG=Eleventy* single build
npm run debugstart    # DEBUG=Eleventy* with --serve
npm run benchmark     # DEBUG=Eleventy:Benchmark*
```

## Project structure

```
public/            Static assets copied verbatim to site root (favicon, images)
_11ty/             Custom Eleventy plugins (github-content.js: {% githubRaw %} shortcode)
src/
  _data/site.js      Site title, description, URL, theme names, Utterances config
  _includes/
    css/base.css     Tailwind entry point
    layouts/         default / post / project / empty layouts
    navbar, footer, dark-toggler, postlist, projectlist partials
  posts/             Blog posts (markdown), permalink /articles/{slug}/
  projects/          Project pages (markdown), permalink /projects/{slug}/
  utils/             404, robots.txt, rss, sitemap
  index / about / articles / projects / tags   Top-level pages
eleventy.config.js   Collections, filters, shortcodes, plugin wiring
tailwind.config.js   Themes, typography, dark-mode selector
.pages.yml           Pages CMS schema for posts and projects
```

## Content

Posts and projects are markdown files with frontmatter. The frontmatter fields are defined in [.pages.yml](.pages.yml) — keep that schema in sync with any new fields the templates read.

- Posts live in `src/posts/`, tagged `post`, published under `/articles/{slug}/`.
- Projects live in `src/projects/`, tagged `project`, published under `/projects/{slug}/`. Projects with `hidden: true` in their frontmatter are excluded from listings (the page itself still builds).

## Customization notes

- Site metadata: [src/_data/site.js](src/_data/site.js).
- Themes: edit the `themes` array in [tailwind.config.js](tailwind.config.js) (DaisyUI theme names). The dark-mode selector is `[data-theme="night"]`.
- Custom Liquid helpers (in [eleventy.config.js](eleventy.config.js)): `similarPosts`, `techPill`, `contrastColor`, `postTags`, `wavy`, `getCssContent`, plus `githubRaw` from the `_11ty/` plugin.
