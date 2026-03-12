<template>
  <Icon :icon="icon" :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']" :style="getWrapStyle" />
</template>

<script setup lang="ts">
  import { Icon, } from "@iconify/vue"
  import { computed } from "vue"
  import { isNumber } from "lodash-es"

  defineOptions({ inheritAttrs: false, name: "Icon" })

  const props = defineProps({
    icon: { type: String, default: "" },
    color: { type: String, default: "" },
    size: { type: [Number, String], default: "16px" },
    /** 是否需要旋转动画 */
    spin: { type: Boolean, default: false },
    /** 图标前缀 */
    prefix: { type: String, default: "" },
  })

  const getWrapStyle = computed(() => {
    const { size, color } = props

    let fs = size
    if (isNumber(size)) fs = `${size}px`

    return {
      fontSize: fs,
      color: color,
      display: "inline-flex",
    }
  })
</script>

<style lang="less" scoped>
  .app-iconify {
    display: inline-block;
    vertical-align: middle;
    &-spin {
      svg {
        animation: loadingCircle 1s infinite linear;
      }
    }
  }

  span.iconify {
    display: block;
    min-width: 1em;
    min-height: 1em;
    border-radius: 100%;
  }

  @keyframes loadingCircle {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
