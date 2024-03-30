<template>
  <StyleProvider hash-priority="high">
    <ConfigProvider :locale="localeCn" :prefix-cls="PREFIX_CLS" :theme="themeConfig">
      <RouterView />
    </ConfigProvider>
  </StyleProvider>
</template>

<script setup lang="ts">
  import type { ThemeConfig } from "ant-design-vue/es/config-provider/context"
  import { RouterView } from "vue-router"
  import { StyleProvider, ConfigProvider, theme } from "ant-design-vue"
  import localeCn from "ant-design-vue/es/locale/zh_CN"
  import { PREFIX_CLS, PRIMARY_COLOR } from "/@/config/project"
  import dayjs from "dayjs"
  import "dayjs/locale/zh-cn"
  import { computed, unref } from "vue"
  import { useAppStore } from "./stores/modules/app"
  import { ThemeEnum } from "./enums/appEnum"

  dayjs.locale("zh-cn")

  const appStore = useAppStore()
  const { darkAlgorithm } = theme

  const getDarkMode = computed(() => appStore.getDarkMode)

  const getThemeColor = computed(() => appStore.getProjectConfig.themeColor || PRIMARY_COLOR)

  // 主体切换
  const themeConfig = computed((): ThemeConfig => {
    return Object.assign(
      {
        token: {
          colorPrimary: unref(getThemeColor),
        },
      },
      unref(getDarkMode) === ThemeEnum.DARK ? { algorithm: [darkAlgorithm] } : {},
    )
  })
</script>
