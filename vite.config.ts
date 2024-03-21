/**
 * @file Vite Configuration
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */

import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import { PREFIX_CLS } from "/@/config/project"

const { NODE_ENV } = process.env
const isProduction = NODE_ENV === "production"

export default defineConfig({
  base: "./",
  root: fileURLToPath(new URL("./", import.meta.url)),
  server: { host: true, port: 4075 },
  plugins: [vue(), vueJsx(), Components({ resolvers: [AntDesignVueResolver({ importStyle: false })] })],
  build: {
    minify: isProduction,
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // "a": ["@ant-design/icons-vue"],
          // "b": ["@vueuse/core"],
          // "c": ["ant-design-vue"],
          // "d": ["dayjs"],
          // "e": ["lodash-es"],
          // "f": ["pinia"],
          // "g": ["vue"],
          // "h": ["vue-router"]
        },
      },
    },
  },
  esbuild: { pure: isProduction ? ["debugger", "console.log"] : undefined },

  css: {
    preprocessorOptions: {
      less: { modifyVars: { "@ant-prefix": PREFIX_CLS }, javascriptEnabled: true },
    },
  },
  resolve: {
    alias: {
      "/@": fileURLToPath(new URL("./src", import.meta.url)),
      "/#": fileURLToPath(new URL("./types", import.meta.url)),
      "/&": fileURLToPath(new URL("./build", import.meta.url)),
    },
  },
})
