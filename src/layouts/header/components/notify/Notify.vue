<template>
  <div :class="`${PREFIX_CLS}-layout-notify`" class="px-2">
    <Popover trigger="click">
      <Tooltip title="系统通知" placement="bottom">
        <BellOutlined class="hover:text-primary"/>
      </Tooltip>
      <template #content>弹窗类下降</template>
    </Popover>
  </div>
</template>

<script setup lang="ts"> 
  import { PREFIX_CLS } from "/@/config/project"
  import { Popover, Tooltip } from "ant-design-vue"
  import { BellOutlined } from "@ant-design/icons-vue"

  defineOptions({ inheritAttrs: false, name: "LayoutHeaderNotify" })
</script>
