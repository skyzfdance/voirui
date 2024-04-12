/**
 * @file Modal 拖拽 hook
 * @module src/components/Modal/src/hooks/useModalDrag.ts
 */

import { nextTick, unref, watchEffect, type Ref } from "vue"
import { buildClass } from "/@/hooks/useClass"

interface UseModalDragMoveContext {
  /** 是否允许拖拽 */
  draggable: Ref<boolean>
  /** 关闭时销毁 Modal 里的子元素 */
  destroyOnClose: Ref<boolean | undefined> | undefined
  /** 弹窗是否可见 */
  open: Ref<boolean>
}

/**
 *
 * @param context
 */
export function useModalDrag(context: UseModalDragMoveContext) {
  const prefixCls = buildClass("modal")

  function getStyle(dom: Element): CSSStyleDeclaration {
    return getComputedStyle(dom)
  }

  function drag(wrap: Element) {
    if (!wrap) return
    wrap.setAttribute("data-drag", String(unref(context.draggable))) // 设置是否可拖拽，用于判断是否需要拖拽
    const dialogHeaderEl: HTMLDivElement | null = wrap.querySelector(`.${prefixCls}-header`) // 拖拽事件触发的元素
    const dragDom: HTMLDivElement | null = wrap.querySelector(`.${prefixCls}`) // 拖拽移动的板块，需要整个 modal 移动

    if (!dialogHeaderEl || !dragDom) return

    dialogHeaderEl.style.cursor = "move"

    nextTick(() => {
      dialogHeaderEl.onmousedown = (e: MouseEvent) => {
        const disX = e.clientX // 鼠标按下时的位置
        const disY = e.clientY // 鼠标按下时的位置

        const screenWidth = document.body.clientWidth // body 的宽
        const screenHeight = document.body.clientHeight // body 的高

        const dragDomWidth = dragDom.offsetWidth // modal 的宽
        const dragDomheight = dragDom.offsetHeight // modal 的高

        const minDragDomLeft = dragDom.offsetLeft // modal 距离左边的最小值
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth // modal 距离右边的最大值

        const minDragDomTop = dragDom.offsetTop // modal 距离上边的最小值
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight // modal 距离下边的最大值

        const domLeft = getStyle(dragDom).left
        const domTop = getStyle(dragDom).top

        let styL = 0
        let styT = 0

        if (domLeft.includes("%")) {
          styL = screenWidth * (Number(domLeft.replace(/%/g, "")) / 100)
          styT = screenHeight * (Number(domTop.replace(/%/g, "")) / 100)
        } else {
          styL = Number(domLeft.replace(/px/g, ""))
          styT = Number(domTop.replace(/px/g, ""))
        }

        document.onmousemove = (e: MouseEvent) => {
          let left = e.clientX - disX // 移动后的位置
          let top = e.clientY - disY // 移动后的位置

          // 边界处理
          if (-left > minDragDomLeft) {
            left = -minDragDomLeft
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft
          }

          if (-top > minDragDomTop) {
            top = -minDragDomTop
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop
          }

          // 移动当前元素
          dragDom.style.left = `${left + styL}px`
          dragDom.style.top = `${top + styT}px`
        }

        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    })
  }

  /** 处理拖拽，创建拖拽方法 */
  function handleDrag() {
    const dragWraps = document.querySelectorAll(`.${prefixCls}-wrap`)
    for (const wrap of dragWraps) {
      const display = getStyle(wrap)?.display
      if (display === "none") continue
      const draggable = wrap.getAttribute("data-draggable")
      if (!draggable || unref(context.destroyOnClose)) {
        drag(wrap)
      }
    }
  }

  watchEffect(() => {
    if (!unref(context.open) || !unref(context.draggable)) return

    nextTick(() => {
      handleDrag()
    })
  })
}
