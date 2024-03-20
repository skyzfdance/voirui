import { createVNode, defineComponent, reactive, render, type VNode } from "vue"
import { LoadingProps } from "./typing"
import { Loading } from ".."

/**
 * 动态创建 Loading 组件
 * @param props LoadingProps
 * @param target 加载节点
 * @param wait 是否需要延迟加载
 */
export function createLoading(props?: Partial<LoadingProps>, target?: HTMLElement, wait = false) {
  let instance: Nullable<VNode> = null

  const data = reactive({
    tips: "加载中...",
    loading: true,
    size: "30px",
    absolute: false,
    background: "rgba(0, 0, 0, 0.7)",
    theme: "light",
    ...props,
  })

  const LoadingWrap = defineComponent({
    render() {
      return createVNode(Loading, data, null)
    },
  })

  instance = createVNode(LoadingWrap)

  if (wait) {
    // XXX 如果设计在 setup 中使用，需要延迟加载，有可能存在 async setup 的情况
    // XXX onMounted is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.
    setTimeout(() => {
      render(instance, document.createElement("div"))
    }, 0)
  } else {
    render(instance, document.createElement("div"))
  }

  function close() {
    if (!instance || !instance.el) return
    instance.el.remove()
  }

  function open(target: HTMLElement = document.body) {
    if (!instance || !instance.el) return
    target.appendChild(instance.el as Node)
  }

  target && open(target)

  return {
    open,
    close,
    setTip: (tip: string) => {
      data.tips = tip
    },
    setLoading: (loading: boolean) => {
      data.loading = loading
    },
    setOptions: (options: Partial<LoadingProps>) => {
      Object.assign(data, options)
    },
  }
}
