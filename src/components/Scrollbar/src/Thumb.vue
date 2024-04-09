<template>
  <Transition :name="`${prefixCls}-fade`">
    <div v-show="always || visible" ref="instance" :class="getInstanceClass" @mousedown="clickTrackHandler">
      <div ref="thumb" :class="`${prefixCls}-thumb`" :style="getThumbStyle" @mousedown="clickThumbHandler"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { type CSSProperties, computed, ref, unref, inject, toRef, onBeforeUnmount } from "vue"
  import { buildClass } from "/@/hooks/useClass"
  import { BAR_MAP } from "./helpers"
  import { scrollbarContextKey } from "./constants"
  import { useEventListener } from "@vueuse/core"

  defineOptions({ name: "Thumb", inheritAttrs: false })

  const props = defineProps({
    /** 滚动条总是显示 */
    always: { type: Boolean, default: false },
    /** 是否垂直滚动条 */
    vertical: { type: Boolean, default: false },
    /** 滚动条尺寸，单位px，如果 vertical = true ，当前值用于 height，否者 用于 width  */
    size: { type: String },
    /** 滚动条偏移值, translate 属性值，如果 vertical，当前表示  translateY(move%), 否者为 translateX(move%) */
    move: { type: Number },

    ratio: { type: Number, required: true },
  })

  const prefixCls = buildClass("scrollbar")

  const scrollbar = inject(scrollbarContextKey)

  if (!scrollbar) {
    throw new Error("Thumb can not inject scrollbar context")
  }

  let cursorDown = false // 鼠标是否按下
  let cursorLeave = true // 鼠标是否离开
  let originalOnSelectStart: ((this: GlobalEventHandlers, ev: Event) => any) | null = document.onselectstart

  const visible = ref(false)
  const instance = ref<HTMLDivElement | null>(null)
  const thumb = ref<HTMLDivElement | null>(null)
  const thumbState = ref<Partial<Record<"X" | "Y", number>>>({})

  const bar = computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"])

  const getInstanceClass = computed(() => [`${prefixCls}-bar`, `is-${unref(bar).key}`])

  const getThumbStyle = computed((): CSSProperties => {
    const baropts = unref(bar)

    return {
      [baropts.size]: props.size,
      transform: `translate${baropts.axis}(${props.move}%)`,
    }
  })

  const offsetRatio = computed(() => {
    // ** 幂计算，求取 a 的 b 次幂
    return unref(instance)![unref(bar).offset] ** 2 / scrollbar.wrapElement![unref(bar).scrollSize] / props.ratio / unref(thumb)![unref(bar).offset]
  })

  onBeforeUnmount(() => {
    restoreOnselectstart()
    document.removeEventListener("mouseup", mouseUpDocumentHandler)
  })

  /**
   * 点击滚动条轨道, 滚动到指定位置
   * @param e
   */
  function clickTrackHandler(e: MouseEvent) {
    if (!unref(thumb) || !unref(instance) || !scrollbar?.wrapElement) return

    // 计算触发事件的元素的位置和鼠标指针的位置之间的偏移量
    const offset = Math.abs((e.target as HTMLDivElement)?.getBoundingClientRect()[unref(bar).direction] - e[unref(bar).client])

    const thumbHalf = unref(thumb)![unref(bar).offset] / 2

    const thumbPositionPercentage = ((offset - thumbHalf) * 100 * unref(offsetRatio)) / unref(instance)![unref(bar).offset]

    scrollbar.wrapElement[unref(bar).scroll] = (thumbPositionPercentage * scrollbar.wrapElement[unref(bar).scrollSize]) / 100
  }

  /**
   * 点击滚动条滑块
   * @param e
   */
  function clickThumbHandler(e: MouseEvent) {
    e.stopPropagation()
    if (e.ctrlKey || [1, 2].includes(e.button)) return

    window.getSelection()?.removeAllRanges()

    startDrag(e)

    // 初始化滑块位置
    const el = e.currentTarget as HTMLDivElement
    if (!el) return
    thumbState.value[unref(bar).axis] = el[unref(bar).offset] - (e[unref(bar).client] - el.getBoundingClientRect()[unref(bar).direction])
  }

  /**
   * 开始拖拽
   * @param e
   */
  function startDrag(e: MouseEvent) {
    e.stopImmediatePropagation()
    cursorDown = true
    document.addEventListener("mousemove", mouseMoveDocumentHandler)
    document.addEventListener("mouseup", mouseUpDocumentHandler)
    // 保存原始的选择事件
    originalOnSelectStart = document.onselectstart
    // 禁止选中文本
    document.onselectstart = () => false
  }

  /**
   * 鼠标移动事件
   * @param e
   */
  function mouseMoveDocumentHandler(e: MouseEvent) {
    if (!unref(instance) || !unref(thumb) || !scrollbar) return
    if (!cursorDown) return

    const prevPage = unref(thumbState)[unref(bar).axis]
    if (!prevPage) return

    const offset = (unref(instance)?.getBoundingClientRect()[unref(bar).direction] - e[unref(bar).client]) * -1

    const thumbClickPosition = unref(thumb)![unref(bar).offset] - prevPage

    const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 * unref(offsetRatio)) / unref(instance)![unref(bar).offset]

    scrollbar.wrapElement![unref(bar).scroll] = (thumbPositionPercentage * scrollbar.wrapElement![unref(bar).scrollSize]) / 100
  }

  /** 鼠标抬起事件 */
  function mouseUpDocumentHandler() {
    cursorDown = false
    thumbState.value[unref(bar).axis] = 0
    document.removeEventListener("mousemove", mouseMoveDocumentHandler)
    document.removeEventListener("mouseup", mouseUpDocumentHandler)
    restoreOnselectstart()
    cursorLeave && (visible.value = false)
  }

  /** 恢复原始的选择事件 */
  function restoreOnselectstart() {
    if (document.onselectstart !== originalOnSelectStart) {
      document.onselectstart = originalOnSelectStart
    }
  }

  /**  */
  function mouseMoveScrollbarHandler() {
    cursorLeave = false
    visible.value = !!props.size
  }

  function mouseLeaveScrollbarHandler() {
    cursorLeave = true
    visible.value = cursorDown
  }

  // addEventListener 并 自动 removeEventListener
  useEventListener(toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler)

  useEventListener(toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler)
</script>
