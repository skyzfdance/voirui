<template>
  <MenuItem :key="item.path">
    <MenuItemContent :item="item" :collapsed="collapsed" />
  </MenuItem>
</template>

<script setup lang="ts">
  import { type MergedRoute } from "/@/router/types"
  import { MenuItem } from "ant-design-vue"

  import MenuItemContent from "./MenuItemContent.vue"

  defineOptions({ inheritAttrs: false, name: "BasicMenuItem" })

  defineProps({
    item: {
      type: Object as PropType<MergedRoute>,
      default: () => ({}),
    },
    collapsed: { type: Boolean, default: false },
  })
</script>
