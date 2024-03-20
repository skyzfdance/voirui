/**
 * @file hooks/usePage.ts
 * @module hooks/usePage
 * @description 页面跳转相关的自定义 hooks
 */

import { useRouter } from "vue-router"

/**
 * 内部路由跳转
 * @param path 跳转路由
 * @param replaceFlag 是否使用replace跳转
 */
export function useGo() {
  const { push, replace } = useRouter()
  function go(path: string, replaceFlag = false) {
    if (!path) return

    replaceFlag
      ? replace(path).catch((err) => {
          console.error("useGo => replace", err)
        })
      : push(path).catch((err) => {
          console.error("useGo => push", err)
        })
  }

  return go
}

/**
 * 打开新窗口
 * @param url
 * @param opt
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open
 */
export function openWindow(url: string, opt?: { target?: "_self | _blank | _parent | _top"; noopener?: boolean; noreferrer?: boolean }) {
  if (!url) return

  const { target = "__blank", noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push("noopener=yes")
  noreferrer && feature.push("noreferrer=yes")

  window.open(url, target, feature.join(","))
}
