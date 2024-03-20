<template>
  <div :class="`${PREFIX_CLS}-layout-breadcrumb`">
    <Breadcrumb :routes="routes">
      <template #itemRender="{ route, routes, paths }">
        <!-- 如果是最后一级，直接显示文字，否则显示链接 -->
        <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
        <RouterLink v-else :to="paths.join('/')">{{ route.breadcrumbName }}</RouterLink>
      </template>
    </Breadcrumb>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import { PREFIX_CLS } from "/@/config/project"
  import { Breadcrumb } from "ant-design-vue"

  interface Route {
    path: string  // 跳转路径
    breadcrumbName: string // 面包屑名称
    children?: Array<{
      path: string
      breadcrumbName: string
    }>
  }
  
  defineOptions({ inheritAttrs: false, name: "LayoutHeaderBreadcrumb" })

  const routes = computed((): Route[] => {
    return []
  })


</script>
