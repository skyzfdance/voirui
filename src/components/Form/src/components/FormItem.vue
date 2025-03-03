<template>
  <div>FormItem</div>
</template>

<script setup lang="ts">
  import { SchemaProps } from "../types/props"

  defineOptions({ name: "FormItem", inheritAttrs: false })

  const props = defineProps({
    /** 当前表单配置实例 */
    schema: {
      type: Object as PropType<SchemaProps>,
      default: () => {},
    },
  })
</script>
