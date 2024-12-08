/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,liquid,njk}", "./.eleventy.js"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["retro", "night"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  darkMode: ['selector', '[data-theme="night"]'],
}

