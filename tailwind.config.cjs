
/**
 * @see https://tailwindcss.com/
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
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
    },
  },
  plugins: [],
}
