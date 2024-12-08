/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,liquid,njk}", "./.eleventy.js"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
}

