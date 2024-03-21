<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="absolute right-4 top-4">
      <AppDarkModeToggle />
    </div>

    <div class="xl:hidden">
      <AppLogo always-show-title />
    </div>

    <div class="container"> 主题区 </div>
  </div>
</template>

<script setup lang="ts">
  import AppLogo from "/@/components/Application/AppLogo.vue"
  import AppDarkModeToggle from "/@/components/Application/AppDarkModeToggle.vue";
  import { buildClass } from "/@/hooks/useClass"

  const prefixCls = buildClass("login")
</script>

<style lang="less" scoped>

</style>
