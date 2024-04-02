import { tryOnUnmounted } from "@vueuse/core"
import { ref, unref } from "vue"

/**
 * 简化版本倒计时执行器，提供倒计时的开始、重置、停止、清除、重启等功能
 * @param count 倒计时时间，单位 秒
 */
export function useCountdown(count: number) {
  const currentCount = ref(count)
  const isStart = ref(false)

  let timerId: ReturnType<typeof setInterval> | null

  function clear() {
    timerId && window.clearInterval(timerId)
  }

  function stop() {
    isStart.value = false
    clear()
    timerId = null
  }

  function start() {
    if (unref(isStart) || !!timerId) {
      return
    }
    isStart.value = true
    timerId = setInterval(() => {
      if (unref(currentCount) === 1) {
        stop()
        currentCount.value = count
      } else {
        currentCount.value -= 1
      }
    }, 1000)
  }

  function reset() {
    currentCount.value = count
    stop()
  }

  function restart() {
    reset()
    start()
  }

  tryOnUnmounted(() => {
    reset()
  })

  return { start, reset, restart, clear, stop, currentCount, isStart }
}
