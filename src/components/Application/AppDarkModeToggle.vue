<template>
  <div :class="prefixCls">
    <Switch :checked="getDarkMode" :checkedValue="ThemeEnum.DARK" :unCheckedValue="ThemeEnum.LIGHT" @click="toggleDarkMode">
      <template #checkedChildren>
        <Icon icon="emojione:sun" />
      </template>
      <template #unCheckedChildren>
        <Icon icon="icon-park:moon" />
      </template>
    </Switch>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import { buildClass, updateDarkTheme } from "/@/hooks/useClass"
  import { Switch } from "ant-design-vue"
  import Icon from "/@/components/Icon/Icon.vue"
  import { useAppStore } from "/@/stores/modules/app"
  import { ThemeEnum } from "/@/enums/appEnum"
  import { isString } from "lodash-es"

  defineOptions({ inheritAttrs: false, name: "AppDarkModeToggle" })

  const prefixCls = buildClass("dark-switch")
  const appStore = useAppStore()

  const getDarkMode = computed(() => appStore.getDarkMode)

  function toggleDarkMode(checked: CheckedType) {
    const mode = checked === ThemeEnum.DARK || checked === ThemeEnum.LIGHT ? checked : ThemeEnum.DARK
    updateDarkTheme(mode)
  }
</script>
