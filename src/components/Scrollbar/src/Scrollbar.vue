<template>
  <div :class="prefixCls" ref="scrollbarRef">
    <div ref="wrapRef" :class="getWrapClass" :style="getWrapStyle" @scroll="handleScroll">
      <component :is="tag" :id="id" ref="resizeRef" :class="getResizeCls" :style="viewStyle">
        <slot></slot>
      </component>
    </div>

    <template v-if="!native">
      <Bar ref="barRef" :always="always" :min-size="minSize" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { type CSSProperties, computed, ref, unref, provide, reactive, watch, onMounted, nextTick, onUpdated } from "vue"
  import { defaultProps } from "./props"
  import { buildClass } from "/@/hooks/useClass"
  import { isArray, isNumber, isObject } from "lodash-es"
  import { useDebounceFn, useEventListener, useResizeObserver } from "@vueuse/core"
  import Bar from "./Bar.vue"
  import { scrollbarContextKey } from "./constants"

  defineOptions({ name: "Scrollbar", inheritAttrs: false })

  const props = defineProps(defaultProps)

  const emits = defineEmits(["scroll"])

  const handleScroll = useDebounceFn(handleScrollFn, 300)

  const prefixCls = buildClass("scrollbar")

  let stopResizeObserver: (() => void) | undefined = undefined
  let stopResizeListener: (() => void) | undefined = undefined

  const scrollbarRef = ref<HTMLDivElement | null>(null)
  const wrapRef = ref<HTMLDivElement | null>(null)
  const barRef = ref<InstanceType<typeof Bar> | null>(null)
  const resizeRef = ref<HTMLElement | null>(null)

  const getWrapClass = computed(() => {
    const wrapClass = isArray(props.wrapClass) ? [...props.wrapClass] : [props.wrapClass]

    return [...wrapClass, `${prefixCls}-wrap`, { [`${prefixCls}-wrap-hidden-default`]: !props.native }]
  })

  const getWrapStyle = computed((): CSSProperties => {
    const style: CSSProperties = {}

    if (props.height) {
      style.height = isNumber(props.height) ? `${props.height}px` : props.height
    }

    if (props.maxHeight) {
      style.maxHeight = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight
    }

    return style
  })

  const getResizeCls = computed(() => {
    const viewClass = isArray(props.viewClass) ? [...props.viewClass] : [props.viewClass]

    return [prefixCls + "-view", ...viewClass]
  })

  provide(scrollbarContextKey, reactive({ scrollbarElement: scrollbarRef, wrapElement: wrapRef }))

  watch(
    () => props.noresize,
    (noresize) => {
      if (noresize) {
        stopResizeObserver?.()
        stopResizeListener?.()
      } else {
        ;({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update))
        stopResizeListener = useEventListener("resize", update)
      }
    },
    { immediate: true },
  )

  watch(
    () => [props.maxHeight, props.height],
    () => {
      if (!props.native) {
        nextTick(() => {
          update()
          if (unref(wrapRef)) {
            unref(barRef)?.handleScroll(unref(wrapRef)!)
          }
        })
      }
    },
  )

  onMounted(() => {
    if (!props.native) {
      nextTick(() => {
        update()
      })
    }
  })

  onUpdated(() => update())

  defineExpose({ wrapRef, handleScroll, update, scrollTo, setScrollTop, setScrollLeft })

  function handleScrollFn() {
    if (!unref(wrapRef)) return

    unref(barRef)?.handleScroll(unref(wrapRef)!)

    emits("scroll", {
      scrollTop: unref(wrapRef)?.scrollTop,
      scrollLeft: unref(wrapRef)?.scrollLeft,
    })
  }

  function update() {
    unref(barRef)?.update()
  }

  function scrollTo(arg1: unknown, arg2?: number) {
    if (isObject(arg1)) {
      unref(wrapRef)?.scrollTo(arg1)
    } else if (isNumber(arg1) && isNumber(arg2)) {
      unref(wrapRef)?.scrollTo(arg1, arg2)
    }
  }

  function setScrollTop(value: number) {
    if (!isNumber(value)) return
    unref(wrapRef)!.scrollTop = value
  }

  function setScrollLeft(value: number) {
    if (!isNumber(value)) return
    unref(wrapRef)!.scrollLeft = value
  }
</script>
