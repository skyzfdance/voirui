<template>
  <slot name="insertFooter"></slot>
  <Button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">{{ cancelText }}</Button>
  <slot name="centerFooter"></slot>
  <Button :type="okType" :loading="confirmLoading" v-bind="okButtonProps" @click="handleOk" v-if="showOkBtn">{{ okText }}</Button>
  <slot name="appendFooter"></slot>
</template>

<script setup lang="ts">
  import { Button } from "ant-design-vue"
  import { basicProps } from "../props"

  defineOptions({ name: "ModalFooter", inheritAttrs: false })

  defineProps(basicProps)

  const emits = defineEmits(["cancel", "ok"])

  function handleCancel(e: MouseEvent) {
    emits("cancel", e)
  }

  function handleOk(e: MouseEvent) {
    emits("ok", e)
  }
</script>
