<template>
  <Button v-bind="$attrs" :disabled="getDisabled" :loading="loading" @click="handleStart">{{ getButtonText }}</Button>
</template>

<script setup lang="ts">
  import { Button } from "ant-design-vue"
  import { isFunction, isNull, isUndefined } from "lodash-es"
  import { computed, ref, unref, watch } from "vue"
  import { useCountdown } from "./useCountdown"

  const props = defineProps({
    /** 倒计时时长 */
    count: { type: Number, default: 60 },
    /** 是否禁用 */
    disabled: { type: Boolean, default: false },
    /** 获取验证的必要参数 */
    params: { type: Object, default: null },
    /** 发送验证码接口 */
    api: { type: Function as PropType<(arg?: any) => Promise<boolean>>, default: null },
  })

  const { isStart, currentCount, reset, start } = useCountdown(props.count)

  const loading = ref<boolean>(false)

  const getButtonText = computed(() => (!unref(isStart) ? "获取验证码" : `${unref(currentCount)}秒后重新获取`))

  const getDisabled = computed(() => props.disabled || unref(isStart) || Object.keys(props.params || {}).length <= 0)

  watch(
    () => props.params,
    (value) => {
      if (isNull(value) || isUndefined(value)) {
        reset()
      }
    },
    { immediate: true },
  )

  async function handleStart() {
    if (props.api && isFunction(props.api)) {
      try {
        const res = await props.api({ ...props.params })
        res && start()
      } catch (error) {
        console.error("handleStart", error)
      } finally {
        loading.value = false
      }
    } else {
      start()
    }
  }
</script>
