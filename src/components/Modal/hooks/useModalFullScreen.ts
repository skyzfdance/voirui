import { ref, unref } from "vue"

export function useFullScreen() {
  /** 当前全屏状态 */
  const fullScreenRef = ref(false)

  function handleFullScreen(e: MouseEvent) {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    fullScreenRef.value = !unref(fullScreenRef)
  }

  return { fullScreenRef, handleFullScreen }
}
