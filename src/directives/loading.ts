/**
 * @file v-loading 指令
 */

import { type App, type Directive } from "vue"
import { createLoading } from "/@/components/Loading"

const loadingDirective: Directive = {
  mounted(el, binding) {
    const tips = el.getAttribute("loading-tips") || "加载中..."
    const background = el.getAttribute("loading-background") || "rgba(0, 0, 0, 0.7)"
    const size = el.getAttribute("loading-size") || "30px"
    const fullscreen = !!binding.modifiers.fullscreen

    const instance = createLoading(
      {
        tips,
        background,
        size,
        loading: !!binding.value,
        absolute: !fullscreen,
      },
      fullscreen ? document.body : el,
      true,
    )

    el.instance = instance
  },
  updated(el, binding) {
    const instance = el.instance
    if (!instance) return
    instance.setTip(el.getAttribute("loading-tips") || "加载中...")
    if (binding.oldValue !== binding.value) {
      instance.setLoading(!!binding.value)
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
