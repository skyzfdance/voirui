/**
 * @file 图片预加载 Vite 插件
 * @description 在 index.html 中自动注入 <link rel="preload" as="image"> 标签，实现关键图片资源的预加载
 */
import { type Plugin, type ResolvedConfig } from "vite"
import fg from "fast-glob"

/** 插件配置项 */
interface Options {
  /** 图片匹配模式，支持 glob 语法，如 'images/*.png' */
  dir: string
}

/**
 * 图片预加载插件
 * @description 扫描 public 目录下匹配的图片文件，在 HTML 中生成预加载标签
 * @param options 配置项
 * @example
 * // vite.config.ts
 * preloadImg({ dir: 'images/background/*.{png,jpg}' })
 */
export function preloadImg(options: Options): Plugin {
  const { dir } = options
  let viteConfig: ResolvedConfig

  return {
    name: "vite-plugin-preload-img",

    // 获取解析后的 Vite 配置
    configResolved(config) {
      viteConfig = config
    },

    // 转换 index.html，注入预加载标签
    transformIndexHtml(_, ctx) {
      if (!viteConfig) throw new Error("viteConfig is not defined")

      // 读取对应配置，让其生产与开发环境都生效
      const { publicDir, base } = viteConfig

      // 扫描匹配的图片文件并拼接完整路径
      const files = fg.sync(dir, { cwd: publicDir }).map((file) => base + file)

      console.log("preloadImg", files)

      // 生成 preload link 标签
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
