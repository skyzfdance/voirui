<template>
  <ScrollContainer ref="wrapperRef" :scroll-height="realHeight">
    <div ref="spinRef" v-loading="loading" :loading-tips="loadingTips" :style="getWrapStyle">
      <slot></slot>
    </div>
  </ScrollContainer>
</template>

<script setup lang="ts">
  import { isNumber } from "lodash-es"
  import { type CSSProperties, computed, ref, unref, onMounted, nextTick, watch } from "vue"
  import { ScrollContainer } from "/@/components/Container"
  import { useMutationObserver } from "@vueuse/core"

  defineOptions({ inheritAttrs: false, name: "ModalWrapper" })

  defineExpose({ setModalHeight })

  const props = defineProps({
    /** 加载loading */
    loading: { type: Boolean, default: false },
    /** 加载提示 */
    loadingTips: { type: String, default: "加载中..." },
    /** 最小高度 */
    minHeight: { type: [Number, String], default: 300 },
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

  const wrapperRef = ref<InstanceType<typeof ScrollContainer> | null>(null)
  const spinRef = ref<HTMLDivElement | null>(null)
  const realHeightRef = ref<number>(0)
  const realHeight = ref(0)
  const minRealHeightRef = ref(0)

  const getWrapStyle = computed((): CSSProperties => {
    const style: CSSProperties = {
      minHeight: isNumber(props.minHeight) ? `${props.minHeight}px` : props.minHeight,
    }

    // 如果全屏后，没有maxHeight属性，一定是可视区高度
    if (props.fullScreen) {
      style.height = unref(realHeightRef) + "px"
    } else {
      if (props.height) {
        style.height = isNumber(props.height) ? `${props.height}px` : props.height
      } else {
        style.maxHeight = unref(realHeightRef) + "px"
      }
    }

    return style
  })

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

  watch(
    () => props.fullScreen,
    (val) => {
      setModalHeight()
      if (!val) {
        realHeightRef.value = unref(minRealHeightRef)
      } else {
        minRealHeightRef.value = unref(realHeightRef)
      }
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

    const bodyDom = wrapperRefDom.$el.parentElement
    if (!bodyDom) return
    bodyDom.style.padding = "0px"

    await nextTick()

    const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement
    if (!modalDom) return

    /**
     * getComputedStyle 获取元素的最终样式
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
     */
    const modalRect: CSSStyleDeclaration = getComputedStyle(modalDom)
    const modalTop = Number(modalRect.top.replace("px", ""))
    // 这里必须外部传入，如果使用节点获取，假设页面上有多个弹窗，不一样的配置，就会出现问题
    let maxHeight = window.innerHeight - modalTop * 2 - props.modalFooterHeight - props.modalHeaderHeight
    // 防止距离顶部太近，导致高度不够，出现异常滚动条
    if (modalTop < 40) maxHeight -= 26

    const spinEl = unref(spinRef)
    if (!spinEl) return

    await nextTick()
    realHeight.value = spinEl.scrollHeight

    if (props.fullScreen) {
      realHeightRef.value = window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight
    } else {
      realHeightRef.value = props.height
        ? isNumber(props.height)
          ? props.height
          : Number(props.height.replace("px", ""))
        : unref(realHeight) > maxHeight
          ? maxHeight
          : unref(realHeight)
    }

    emits("height-change", unref(realHeightRef))
  }
</script>
