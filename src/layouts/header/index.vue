<template>
  <div class="w-full flex justify-between items-center">
    <div class="ml-2 flex items-center">
      <div class="cursor-pointer mr-4" @click.stop="handleCollapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </div>
      <Breadcrumb />
    </div>
    <div class="flex justify-end items-center mr-2">
      <SearchCmp />
      <NotifyCmp />
      <UserCmp />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue"
  import Breadcrumb from "./components/Breadcrumb.vue"
  import { createAsyncComponent } from "/@/utils/createAsyncComponent"

  // 异步导入组件
  const NotifyCmp = createAsyncComponent(() => import("./components/notify/Notify.vue"))
  const UserCmp = createAsyncComponent(() => import("./components/user/User.vue"))
  const SearchCmp = createAsyncComponent(() => import("./components/search/Search.vue"))

  defineOptions({ inheritAttrs: false, name: "DefaultLayoutHeader" })

  const props = defineProps({
    /** 侧栏状态，true 收起 | false 展开 */
    collapsed: { type: Boolean, default: false },
  })

  const emits = defineEmits(["change-collapsed"])

  function handleCollapsed() {
    const flag = !props.collapsed
    emits("change-collapsed", flag)
  }
</script>
