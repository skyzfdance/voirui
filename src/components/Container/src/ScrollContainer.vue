<template>
  <Scrollbar ref="scrollbarRef" class="scroll-container" :height="scrollHeight">
    <slot></slot>
  </Scrollbar>
</template>

<script setup lang="ts">
  import { nextTick, ref, unref } from "vue"
  import { Scrollbar } from "/@/components/Scrollbar"

  defineOptions({ name: "ScrollContainer", inheritAttrs: false })

  defineProps({ scrollHeight: { type: Number, default: 0 } })

  defineExpose({ scrollTo })

  const scrollbarRef = ref<InstanceType<typeof Scrollbar> | null>(null)

  /**
   * 滚动到固定位置
   * @param to 滚动距离
   * @param duration 动画时间
   */
  function scrollTo(to: number, duration = 300) {
    nextTick(() => {
      if (!unref(scrollbarRef)) return
      unref(scrollbarRef)?.scrollTo(to, duration)
    })
  }
</script>
