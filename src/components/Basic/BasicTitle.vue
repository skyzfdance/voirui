<template>
  <span :class="getClass">
    <slot></slot>
    <BasicHelp :class="`${prefixCls}-help`" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>

<script setup lang="ts">
  import { computed } from "vue"
  import { PREFIX_CLS } from "/@/config/project"
  import BasicHelp from "./BasicHelp.vue";

  defineOptions({ inheritAttrs: false, name: "BasicTitle" })

  const props = defineProps({
    /** 提示文本 | 文本列表 */
    helpMessage: { type: [String, Array] as PropType<string | string[]>, default: "" },
    /** 是否加粗文本 */
    normal: { type: Boolean, default: false },
  })

  const prefixCls = PREFIX_CLS + "-basic-title"

  const getClass = computed(() => [prefixCls, { [`${prefixCls}-normal`]: props.normal }])
</script>

<style lang="less" scoped>
  @prefix-cls: @ant-prefix;
  .@{prefix-cls}-basic-title {
    @apply flex relative cursor-pointer select-none pl-2 text-base font-bold;
    &-normal {
      @apply font-normal;
    }
    &-help {
      @apply ml-3;
    }
  }
</style>
