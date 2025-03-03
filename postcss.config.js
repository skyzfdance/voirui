/**
 * @file postcss.config.js
 * @type {import('postcss').Postcss}
 * @see https://tailwindcss.com/docs/installation#post-css-7-compatibility-build
 * 
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
}
