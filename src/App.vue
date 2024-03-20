<template>
  <StyleProvider hash-priority="high">
    <ConfigProvider :locale="localeCn" :prefix-cls="PREFIX_CLS" :theme="{ token: { colorPrimary: PRIMARY_COLOR } }">
      <RouterView />
    </ConfigProvider>
  </StyleProvider>
</template>

<script setup lang="ts">
  import { RouterView } from "vue-router"
  import { StyleProvider, ConfigProvider } from "ant-design-vue"
  import localeCn from "ant-design-vue/es/locale/zh_CN"
  import { PREFIX_CLS, PRIMARY_COLOR } from "/@/config/project"
  import dayjs from "dayjs"
  import "dayjs/locale/zh-cn"

  dayjs.locale("zh-cn")

</script>
