import { type Plugin, type ResolvedConfig } from "vite"
import fg from "fast-glob"

interface Options {
  dir: string
}

export function preloadImg(options: Options): Plugin {
  const { dir } = options
  let viteConfig: ResolvedConfig
  return {
    name: "vite-plugin-preload-img",
    configResolved(config) {
      viteConfig = config
    },
    transformIndexHtml(_, ctx) {
      if (!viteConfig) throw new Error("viteConfig is not defined")

      // 读取对应配置，让其生产与开发环境都生效
      const { publicDir, base } = viteConfig

      const files = fg.sync(dir, { cwd: publicDir }).map((file) => base + file)

      console.log("preloadImg", files)
      return files.map((file) => {
        return {
          tag: "link",
          attrs: {
            href: file,
            rel: "preload",
            as: "image",
          },
        }
      })
    },
  }
}
