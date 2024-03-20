<template>
  <div :class="`${PREFIX_CLS}-layout-search`" class="px-2" @click.prevent="visible = true">
    <Tooltip title="页面检索" placement="bottom">
      <SearchOutlined class="hover:text-primary" />
    </Tooltip>

    <SearchModal :visible="visible" @close="(show) => (visible = show)" />
  </div>
</template>

<script setup lang="ts">
  import { PREFIX_CLS } from "/@/config/project"
  import { Tooltip } from "ant-design-vue"
  import { SearchOutlined } from "@ant-design/icons-vue"
  import { ref } from "vue"
  import SearchModal from "./SearchModal.vue"

  defineOptions({ inheritAttrs: false, name: "LayoutHeaderSearch" })

  const visible = ref<boolean>(false)
</script>
