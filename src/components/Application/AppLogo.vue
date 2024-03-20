<template>
  <div class="flex items-center justify-between cursor-pointer transition-all px-3" :class="{ 'pl-2': !collapsed }">
    <img :src="getLogo" class="h-12 w-12" />
    <div class="text-white truncate flex-1 ml-2" v-if="!collapsed">{{ getTitle }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import defaultLogo from "/@/assets/images/logo.svg"

  defineOptions({ inheritAttrs: false, name: "AppLogo" })

  const props = defineProps({
    /** 是否收缩状态 */
    collapsed: { type: Boolean, default: false },
  })

  const getLogo = computed(() => {
    return defaultLogo
  })

  const getTitle = computed(() => {
    return props.collapsed ? "" : import.meta.env.VITE_APP_TITLE
  })
</script>
