<template>
  <BasicMenuItem v-if="!menuHasChildren(item) && getShowMenu" :item="item" :collapsed="collapsed" />
  <SubMenu v-if="menuHasChildren(item) && getShowMenu" :key="`submenu-${item.path}`">
    <template #title>
      <MenuItemContent :item="item" :collapsed="collapsed" />
    </template>

    <template v-for="childrenItem in item.children" :key="childrenItem.path">
      <BasicSubMenuItem :item="childrenItem" :collapsed="collapsed" />
    </template>
  </SubMenu>
</template>

<script setup lang="ts">
  import { type MergedRoute } from "/@/router/types"

  import BasicMenuItem from "./BasicMenuItem.vue"
  import { computed } from "vue"
  import { SubMenu } from "ant-design-vue"
  import MenuItemContent from "./MenuItemContent.vue"

  defineOptions({ inheritAttrs: false, name: "BasicSubMenuItem" })

  const props = defineProps({
    item: {
      type: Object as PropType<MergedRoute>,
      default: () => ({}),
    },
    collapsed: { type: Boolean, default: false },
  })

  const getShowMenu = computed(() => !props.item.meta.hideMenu)

  function menuHasChildren(item: MergedRoute): boolean {
    return !item.meta.hideChildrenInMenu && Reflect.has(item, "children") && !!item.children && item.children.length > 0
  }
</script>
