<template>
  <BasicTitle :help-message="helpMessage">
    {{ title }}
  </BasicTitle>
</template>

<script setup lang="ts">
  import BasicTitle from "/@/components/Basic/BasicTitle.vue"

  defineOptions({ inheritAttrs: false, name: "ModalHeader" })

  defineProps({
    /** 提示信息 */
    helpMessage: { type: [String, Array] as PropType<string | string[]>, default: "" },
    /** 弹窗标题 */
    title: { type: String, default: "弹窗标题" },
  })
</script>
