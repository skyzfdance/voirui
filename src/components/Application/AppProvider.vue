<template>
  <slot></slot>
</template>

<script setup lang="ts">
  import { PREFIX_CLS } from "/@/config/project"
  import { ref } from "vue"
  import { useAppStore } from "/@/stores/modules/app"

  defineOptions({ inheritAttrs: false, name: "AppProvider" })

  const props = defineProps({
    prefixCls: { type: String, default: PREFIX_CLS },
  })

  const appStore = useAppStore()
  const isMobile = ref(false)
  const isSetState = ref(false)




</script>
<style scoped lang="less">

</style>