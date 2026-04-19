import EleventyFetch from "@11ty/eleventy-fetch";

const getGitHubRaw = async (path) => {
    const normalizedPath = path.replace(/^\/|\/$/g, "");
    const url = `https://github.com/${normalizedPath}?raw=true`;

    try {
        const content = await EleventyFetch(url, {
            duration: "1d", // save for 1 day
            type: "text", // we'll get a string back
            fetchOptions: {
                headers: {
                    // Prevent generic fetching errors when possible
                    "user-agent": "Eleventy (milehighcoder)"
                }
            }
        });

        return content;
    } catch (error) {
        console.error(`EleventyFetch failed for ${url}:`, error.message);
        // Fallback for offline dev if cache is missing to avoid breaking the entire build
        return `> **Warning**: Failed to fetch GitHub raw content for \`${normalizedPath}\` (offline or error).`;
    }
};

export default {
    initArguments: {},
    configFunction: async (eleventyConfig = {}) => {
        eleventyConfig.addShortcode("githubRaw", getGitHubRaw);
    }
};
