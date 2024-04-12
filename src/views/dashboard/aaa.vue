<template>
  <BasicModal
    width="800px"
    title="123123123"
    :destroy-on-close="true"
    :help-message="['测试help-messagh', '测试机阿萨德刚与阿是', 'asdgausdgas']"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <div class="bg-slate-500"> insertFooter </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from "/@/components/Modal"

  defineEmits(["success", "register"])

  const [registerModal] = useModalInner((data) => {
    console.log("aaa", data)
  })

  async function handleSubmit() {}
</script>
