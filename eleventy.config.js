import CleanCSS from "clean-css";
import fs from "fs/promises"
import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import githubContent from "./_11ty/github-content.js";

export default function (eleventyConfig) {
  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
  eleventyConfig.addLiquidFilter(
    "getNewestCollectionItemDate",
    pluginRss.getNewestCollectionItemDate
  );

  eleventyConfig.addLiquidShortcode("getCssContent", async function() {
    try {
      const cssContent = await fs.readFile("./_site/output.css", "utf8");
      return new CleanCSS({}).minify(cssContent).styles;
    } catch (error) {
      console.error("Error reading CSS file:", error);
      // Throw an error to fail the build
      throw new Error("Failed to read or minify CSS: " + error.message);
    }
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  eleventyConfig.addFilter("postTags", (tags) => {
    const excludeKeys = new Set(["posts", "all", "project", "projects", "post"]); 
    return Object.keys(tags)
      .filter((k) => !excludeKeys.has(k)) 
      .map((k) => ({ name: k, count: tags[k].length }))
      .sort((a, b) => b.count - a.count);
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  eleventyConfig.addLiquidFilter(
    "similarPosts",
    function (collection, path, tags) {
      if (!collection) return [];
      let similarPosts = collection
        .filter((post) => {
          return (
            getSimilarTags(post.data.tags, tags) >= 1 &&
            post.data.page.inputPath !== path
          );
        })
        .sort((a, b) => {
          return (
            getSimilarTags(b.data.tags, tags) -
            getSimilarTags(a.data.tags, tags)
          );
        });
      if (similarPosts.length < 4) {
        similarPosts = similarPosts
          .concat(collection.slice(0, 3))
          .filter((post) => post.data.page.inputPath !== path);
      }
      return getUniquePosts(similarPosts);
    }
  );

  eleventyConfig.addCollection("projects", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md")
                        .filter(project => !project.data.hidden);
  });

  eleventyConfig.addFilter("techPill", function (name) {
    switch (name) {
      case "C#":
        return "#A279DD";
      case "Godot":
        return "#478CBF";
      case "Javascript":
        return "#F9DC5C";
      case "Unity":
        return "#E84855";
      case "Eleventy":
        return "#4C9F70";
      case "Nunjacks":
        return "#D7263D";
      case "HTML/CSS/Tailwindcss":
        return "#0CF574";
      case "Prototype":
        return "#15E6CD";
      default:
        return "#6f1b85";
    }
  });

  eleventyConfig.addFilter("contrastColor", function (bgColor) {
    // Convert the background color to RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    // Calculate the perceived brightness of the color
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return either black or white depending on the brightness
    return brightness > 128 ? "black" : "white";
  });

  eleventyConfig.addShortcode("wavy", function (text) {
    return text
      .split("")
      .map(
        (letter, index) =>
          `<span class="wavy" style="animation-delay: ${
            index * 60
          }ms;">${letter}</span>`
      )
      .join("");
  });

  // Gets content from GitHub
  eleventyConfig.addPlugin(githubContent);

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: ["md", "njk", "html", "liquid"],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "liquid",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "liquid",

    // These are all optional:
    dir: {
      input: "src", // default: "."
    },

    // -----------------------------------------------------------------
    // Optional items:
    // -----------------------------------------------------------------

    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

    // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
    // it will transform any absolute URLs in your HTML to include this
    // folder name and does **not** affect where things go in the output folder.
    pathPrefix: "/",
  };
}

const getSimilarTags = function (categoriesA, categoriesB) {
  if (!categoriesA) return [];
  return categoriesA.filter(Set.prototype.has, new Set(categoriesB)).length;
};

const getUniquePosts = function (posts) {
  const field = "url";
  const uniqueValues = new Set();
  return posts.filter((item) => {
    if (!uniqueValues.has(item[field])) {
      uniqueValues.add(item[field]);
      return true;
    }
    return false;
  });
};
