<template>
  <div :class="`${PREFIX_CLS}-layout-sider`">
    <AppLogo :collapsed="collapsed" />
    <SimpleMenu :collapsed="collapsed" />
  </div>
</template>

<script setup lang="ts">
  import { PREFIX_CLS } from "/@/config/project"
  import AppLogo from "/@/components/Application/AppLogo.vue"

  import SimpleMenu from "./components/SimpleMenu.vue"

  defineOptions({ inheritAttrs: false, name: "DefaultLayoutSider" })

  defineProps({ collapsed: { type: Boolean, default: false } })
</script>
