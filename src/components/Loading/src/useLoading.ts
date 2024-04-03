import { createLoading } from "./createLoading"
import { LoadingProps } from "./typing"

/**
 * hook for loading
 * @param opts
 * @param target
 */
export function useLoading(
  props: Partial<LoadingProps> = {},
  target: HTMLElement = document.body,
): [open: () => void, close: () => void, setTip: (tip: string) => void] {
  const instance = createLoading(props, target, true)

  function open() {
    if (!instance) return
    instance.open()
  }

  function close() {
    if (!instance) return
    instance.close()
  }

  function setTip(tip: string) {
    if (!instance) return
    instance.setTip(tip)
  }

  return [open, close, setTip]
}
