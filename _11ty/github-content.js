const getGitHubRaw = async (path) => {
    const normalizedPath = path.replace(/^\/|\/$/g, "");
    const url = `https://github.com/${normalizedPath}?raw=true`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch content from ${url}: ${response.status} ${response.statusText}`
            );
        }

        const content = await response.text();
        return content;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default {
    initArguments: {},
    configFunction: async (eleventyConfig = {}) => {
        eleventyConfig.addShortcode("githubRaw", getGitHubRaw);
    }
};
