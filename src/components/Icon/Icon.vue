<template>
  <Icon :icon="icon" :class="[$attrs.class, 'app-iconify anticon', spin && 'app-iconify-spin']" :style="getWrapStyle" />
</template>

<script setup lang="ts">
  import { Icon, disableCache } from "@iconify/vue"
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

  // 禁用全部缓存，禁止将图标缓存在 localStorage/sessionStorage 中
  // 每次都从服务器上拉取数据，已减少图标更新后，无法及时更新的问题，并且减少本地存储的大小
  disableCache("all")

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
