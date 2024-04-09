/**
 * @file v-loading 指令
 */

import { type App, type Directive } from "vue"
import { createLoading } from "/@/components/Loading"

const loadingDirective: Directive = {
  mounted(el, binding) {
    const tips = el.getAttribute("loading-tips") || "数据加载中..."
    const background = el.getAttribute("loading-background")
    const size = el.getAttribute("loading-size")
    const fullscreen = el.getAttribute("loading-absolute") || !!binding.modifiers.fullscreen
    const teleport = el.getAttribute("loading-teleport")

    const instance = createLoading(
      {
        tips,
        background,
        size: size || "large",
        loading: !!binding.value,
        absolute: !fullscreen,
      },
      teleport ? document.body : el,
    )
    el.instance = instance
  },
  updated(el, binding) {
    const instance = el.instance
    if (!instance) return
    instance.setTip(el.getAttribute("loading-tips") || "数据加载中...")
    if (binding.oldValue !== binding.value) {
      instance.setLoading(binding.value && !instance.loading)
    }
  },
  unmounted(el) {
    el.instance && el.instance.close()
  },
}

export function setupLoadingDirective(app: App) {
  app.directive("loading", loadingDirective)
}

export default loadingDirective
