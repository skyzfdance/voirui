<template>
  <div>仪表盘</div>
  <Button @click="openModal(true, { aaa: '11111' })">开启</Button>
  <aaa @register="registerModal" />
</template>

<script setup lang="ts">
  import { useModal } from "/@/components/Modal"
  import aaa from "./aaa.vue"
  import { Button } from "ant-design-vue"

  defineOptions({ name: "Dashboard" })

  const [registerModal, { openModal }] = useModal()
</script>
