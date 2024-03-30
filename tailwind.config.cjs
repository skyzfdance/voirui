/**
 * @file Tailwind CSS configuration file
 * @type {import('tailwindcss').Config}
 * @see https://tailwindcss.com/docs/configuration
 */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      textColor: {
        primary: "#0960bd",
      },
      borderColor: {
        primary: "#0960bd",
      },
      backgroundColor: {
        primary: "#0960bd",
      },
      lineHeight: {
        0: "0",
      },
    },
  },
  plugins: [],
}
