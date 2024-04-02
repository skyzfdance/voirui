<template>
  <Input v-model:value="curValue" :disabled="disabled" v-bind="$attrs" :class="prefixCls">
    <template #addonAfter>
      <CountButton :size="$attrs.size" :params="params" :disabled="disabled" :count="count" :api="sendCodeApi" />
    </template>
    <template #[item]="data" v-for="item in Object.keys($slots).filter((k) => k !== 'addonAfter')">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Input>
</template>

<script setup lang="ts">
  import { Input } from "ant-design-vue"
  import CountButton from "./CountButton.vue"
  import { computed } from "vue"
  import { buildClass } from "/@/hooks/useClass"

  defineOptions({ inheritAttrs: false })

  const props = defineProps({
    value: { type: String, default: "" },
    /** 倒计时时长 */
    count: { type: Number, default: 60 },
    /** 是否禁用 */
    disabled: { type: Boolean, default: false },
    /** 发送验证码接口 */
    sendCodeApi: { type: Function as PropType<() => Promise<boolean>>, default: null },
    /** 发送验证码的参数 */
    params: { type: Object as PropType<Recordable>, default: null },
  })

  const emits = defineEmits(["update:value", "change"])

  const prefixCls = buildClass("count-down-input")

  const curValue = computed({
    get: () => props.value,
    set: (val) => {
      emits("update:value", val)
      emits("change", val)
    },
  })
</script>

<style lang="less" scoped>
  @prefix-cls: @ant-prefix;
  .@{prefix-cls}-count-down-input {
    :deep(.@{prefix-cls}-input-group-addon) {
      border: none;
      background-color: transparent;
      padding-right: 0;
    }
  }
</style>
