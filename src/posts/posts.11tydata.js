export default {
  // Set a default layout for everything in the src folder and below.
  layout: "layouts/post.liquid",
  permalink: (data) => {
    if (data.draft === true || data.published === false) {
      return false;
    }
    return `articles/${data.page.fileSlug}/index.html`;
  },
  eleventyComputed: {
    eleventyExcludeFromCollections: (data) => {
      if (data.draft === true || data.published === false) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    },
  },
  tags: ["post"],
};
