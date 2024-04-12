<template>
  <Scrollbar ref="wrapperRef" :height="realHeight">
    <!-- 使用 最大可用高度，防止 loading 位置计算溢出 -->
    <div ref="spinRef" v-loading="loading" :loading-tips="loadingTips" :style="{ height: realHeight + 'px' }">
      <slot></slot>
    </div>
  </Scrollbar>
</template>

<script setup lang="ts">
  import { isNumber } from "lodash-es"
  import { ref, unref, onMounted, nextTick, watch } from "vue"
  import { Scrollbar } from "/@/components/Scrollbar"
  import { useMutationObserver } from "@vueuse/core"
  import { buildClass } from "/@/hooks/useClass"

  defineOptions({ inheritAttrs: false, name: "ModalWrapper" })

  defineExpose({ setModalHeight })

  const props = defineProps({
    /** 加载loading */
    loading: { type: Boolean, default: false },
    /** 加载提示 */
    loadingTips: { type: String, default: "加载中..." },
    /** 最小高度 */
    minHeight: { type: [Number, String], default: 400 },
    /** 是否全屏 */
    fullScreen: { type: Boolean, default: false },
    /** 当前弹窗是否打开 */
    open: { type: Boolean, default: false },
    /** 弹窗头部高度 */
    modalHeaderHeight: { type: Number, default: 57 },
    /** 弹窗底部高度 */
    modalFooterHeight: { type: Number, default: 65 },
    /** 固定高度 */
    height: { type: [String, Number] },
  })

  const emits = defineEmits(["height-change", "ext-height"])

  const wrapperRef = ref<InstanceType<typeof Scrollbar> | null>(null)
  const spinRef = ref<HTMLDivElement | null>(null)
  const realHeight = ref(0) // 滚动容器最大高度

  // 监听内部高度变化, 重新计算高度
  useMutationObserver(
    spinRef,
    () => {
      setModalHeight()
    },
    // attributes 观察节点属性变化
    // subtree 观察所有后代节点
    { attributes: true, subtree: true },
  )

  // TODO 监听页面高度变化，重新计算高度

  watch(
    () => props.fullScreen,
    () => {
      setModalHeight()
    },
  )

  onMounted(() => {
    setModalHeight()
    const { modalHeaderHeight, modalFooterHeight } = props
    emits("ext-height", modalHeaderHeight + modalFooterHeight)
  })

  async function setModalHeight() {
    if (!props.open) return

    const wrapperRefDom = unref(wrapperRef)
    if (!wrapperRefDom) return

    // realHeight 的高度分为两种情况，第一种是全屏，第二种是非全屏
    // 1. 全屏：高度为可视区高度 - 头部高度 - 底部高度，这是一定的，不用计算
    // 2. 非全屏：
    //    1. 如果有设置高度，直接使用设置的高度
    //    2. 如果没有设置高度，获取到当前弹窗的最外层节点，计算可用最大高度
    //       可用最大高度 = 可视区高度 - 弹窗距离顶部的高度 - 底部高度 - 头部高度
    //       如果内容高度大于可用最大高度，使用可用最大高度
    //       如果内容高度小于可用最大高度，使用设置的最小高度

    await nextTick()

    if (props.fullScreen) {
      // 全屏
      realHeight.value = window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight
    } else {
      // 非全屏
      if (props.height) {
        realHeight.value = isNumber(props.height) ? props.height : Number(props.height.replace("px", ""))
      } else {
        // 获取到当前弹窗的最外层节点
        const modalDom = wrapperRefDom.$el.closest(`.${buildClass("modal")}`)
        /**
         * getComputedStyle 获取元素的最终样式
         * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
         */
        const modalRect: CSSStyleDeclaration = getComputedStyle(modalDom)

        // 获取到当前弹窗距离顶部的高度
        const modalTop = Number(modalRect.top.replace("px", ""))

        // 获取可用最大高度 = 可视区高度 - 弹窗距离顶部的高度 * 2 - 底部高度 - 头部高度
        // 这里 * 2 是最大限度，防止距离顶部太近，导致高度不够，出现异常滚动条
        const maxHeight = window.innerHeight - modalTop * 2 - props.modalFooterHeight - props.modalHeaderHeight

        // 获取当前弹窗的内容高度
        const spinEl = unref(spinRef)
        if (!spinEl) return
        const contentHeight = spinEl.scrollHeight

        if (contentHeight > maxHeight) {
          realHeight.value = maxHeight
        } else {
          realHeight.value = isNumber(props.minHeight) ? props.minHeight : Number(props.minHeight.replace("px", ""))
        }
      }
    }

    emits("height-change", unref(realHeight))
  }
</script>
