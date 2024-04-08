<template>
  <!-- 横向滚动条 -->
  <Thumb :move="moveX" :ratio="ratioX" :size="sizeWidth" :always="always" />
  <!-- 纵向滚动条 -->
  <Thumb :move="moveY" :ratio="ratioY" :size="sizeHeight" vertical :always="always" />
</template>

<script setup lang="ts">
  import { inject, ref } from "vue"
  import Thumb from "./Thumb.vue"
  import { scrollbarContextKey } from "./constants"

  defineOptions({ name: "Bar", inheritAttrs: false })

  defineExpose({ handleScroll, update })

  const props = defineProps({
    /** 滚动条总是显示 */
    always: { type: Boolean, default: false },
    /** minSize */
    minSize: { type: Number, required: true },
  })

  const scrollbar = inject(scrollbarContextKey)

  const moveX = ref(0)
  const moveY = ref(0)
  const sizeWidth = ref("")
  const sizeHeight = ref("")
  const ratioY = ref(1)
  const ratioX = ref(1)

  function handleScroll(wrap: HTMLDivElement) {
    if (!wrap) return

    const offsetHeight = wrap.offsetHeight - 4
    const offsetWidth = wrap.offsetWidth - 4

    moveY.value = ((wrap.scrollTop * 100) / offsetHeight) * ratioY.value
    moveX.value = ((wrap.scrollLeft * 100) / offsetWidth) * ratioX.value
  }

  function update() {
    const wrap = scrollbar?.wrapElement
    if (!wrap) return
    const offsetHeight = wrap.offsetHeight - 4
    const offsetWidth = wrap.offsetWidth - 4

    const originalHeight = offsetHeight ** 2 / wrap.scrollHeight
    const originalWidth = offsetWidth ** 2 / wrap.scrollWidth
    const height = Math.max(originalHeight, props.minSize)
    const width = Math.max(originalWidth, props.minSize)

    ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height))
    ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width))

    sizeHeight.value = height + 4 < offsetHeight ? `${height}px` : ""
    sizeWidth.value = width + 4 < offsetWidth ? `${width}px` : ""
  }
</script>
