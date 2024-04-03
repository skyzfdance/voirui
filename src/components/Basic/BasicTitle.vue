<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="`${prefixCls}-help`" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>

<script setup lang="ts">
  import { computed, useSlots } from "vue"
  import BasicHelp from "./BasicHelp.vue"
  import { buildClass } from "/@/hooks/useClass"

  defineOptions({ inheritAttrs: false, name: "BasicTitle" })

  const props = defineProps({
    /** 提示文本 | 文本列表 */
    helpMessage: { type: [String, Array] as PropType<string | string[]>, default: "" },
    /** 是否加粗文本 */
    normal: { type: Boolean, default: false },

    /** 是否显示分割线 */
    span: { type: Boolean, default: true },
  })

  const slots = useSlots()

  const prefixCls = buildClass("basic-title")

  const getClass = computed(() => [prefixCls, { [`${prefixCls}-show-span`]: props.span && slots.default }, { [`${prefixCls}-normal`]: props.normal }])
</script>

<style lang="less" scoped>
  @prefix-cls: @ant-prefix;
  .@{prefix-cls}-basic-title {
    @apply flex relative cursor-pointer select-none pl-2 text-base font-bold items-center;
    &-normal {
      @apply font-normal;
    }

    &-show-span {
      &::before {
        content: "";
        @apply absolute top-1 left-0 w-1 h-4 mr-1 bg-primary;
      }
    }
    &-help {
      @apply ml-3;
    }
  }
</style>
