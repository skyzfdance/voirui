<template>
  <Menu
    mode="inline"
    theme="dark"
    :selected-keys="menuState.selectedKeys"
    :open-keys="menuState.openKeys"
    :class="`${PREFIX_CLS}-basic-menu`"
    :sub-menu-open-delay="0.2"
    @open-change="handleOpenChange"
    @click="handleMenuClick"
  >
    <template v-for="item in items" :key="item.path">
      <BasicSubMenuItem :item="item" :collapsed="collapsed" />
    </template>
  </Menu>
</template>

<script setup lang="ts">
  import type { MenuState } from "../types"
  import { getCurMenus, joinParentPath } from "../helper"
  import { cloneDeep, isEmpty, isArray } from "lodash-es"
  import { Menu } from "ant-design-vue"
  import { reactive, unref } from "vue"
  import { PREFIX_CLS } from "/@/config/project"
  import BasicSubMenuItem from "./BasicSubMenuItem.vue"
  import { useGo } from "/@/hooks/usePage"
  import { useRoute } from "vue-router"
  import { findPath } from "/@/utils/treeHelper"

  defineOptions({ inheritAttrs: false, name: "SimpleMenu" })
  defineProps({ collapsed: { type: Boolean, default: false } })

  const router = useRoute()
  const go = useGo()
  const items = joinParentPath(cloneDeep(getCurMenus()))

  const menuState = reactive<MenuState>({ selectedKeys: [], openKeys: [] })


  // 处理默认菜单展开逻辑，只展开一级菜单
  const path = unref(router).path
  const cur = findPath(items, (i) => i.path === path)
  if (!isEmpty(cur)) {
    menuState.selectedKeys = [path]
    if (isArray(cur)) {
      const { name } = cur[0]
      const keys = `submenu-/${name.toString().toLowerCase()}`
      menuState.openKeys = [keys]
    }
  }

  // 展开菜单
  function handleOpenChange(openKeys: (string | number)[]) {
    menuState.openKeys = openKeys
  }

  // 菜单点击
  function handleMenuClick(data) {
    menuState.selectedKeys = [data.key]
    menuState.openKeys = [data.keyPath[0]]
    go(data.key)
  }
</script>
