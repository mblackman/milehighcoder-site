export default {
  // Set a default layout for everything in the src folder and below.
  layout: "layouts/project.liquid",
  permalink: (data) => {
    if (data.draft === true || data.published === false || data.permalink === false) {
      return false;
    }
    return `projects/${data.page.fileSlug}/index.html`;
  },
  eleventyComputed: {
    eleventyExcludeFromCollections: (data) => {
      if (data.draft === true || data.published === false || data.permalink === false) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    },
  },
  tags: ["project"],
};
