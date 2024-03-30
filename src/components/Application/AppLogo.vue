<template>
  <div :class="getAppLogoClass" @click.stop="go(PageEnum.BASE_HOME)">
    <img :src="getLogo" :alt="getTitle" />
    <div :class="getTitleClass">{{ getTitle }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import defaultLogo from "/@/assets/images/logo.svg"
  import { buildClass } from "/@/hooks/useClass"
  import { useGo } from "/@/hooks/usePage"
  import { PageEnum } from "/@/enums/appEnum"
  import { useAppStore } from "/@/stores/modules/app"

  defineOptions({ inheritAttrs: false, name: "AppLogo" })

  const props = defineProps({
    /** 主题 */
    theme: { type: String, default: "", validator: (val: string) => ["dark", "light", ""].includes(val) },
    /** 是否显示标题 */
    showTitle: { type: Boolean, default: true },
    /** 收缩状态下是否显示标题 */
    alwaysShowTitle: { type: Boolean, default: false }, // TODO 这个应该没啥用
  })

  const prefixCls = buildClass("app-logo")
  const go = useGo()
  const appStore = useAppStore()

  const getLogo = computed(() => appStore.getSiteInfo?.logo ?? defaultLogo)

  const getTitle = computed(() => appStore.getSiteInfo?.siteName ?? import.meta.env.VITE_APP_TITLE)

  const getAppLogoClass = computed(() => [prefixCls, props.theme])

  const getTitleClass = computed(() => [
    `${prefixCls}-title`,
    {
      "xs:opacity-0": !props.alwaysShowTitle,
    },
  ])
</script>

<style lang="less" scoped>
  @prefix-cls: @ant-prefix;

  .@{prefix-cls}-app-logo {
    @apply flex items-center pl-2 cursor-pointer transition-all duration-200;
    &.collapsed-show-title {
      @apply pl-5;
    }
    &.light &-title {
      @apply text-primary;
    }
    &.dark &-title {
      @apply text-white;
    }
    &-title {
      @apply transition-all duration-500 text-base font-bold leading-0 ml-2 truncate md:opacity-100;
    }
  }
</style>
