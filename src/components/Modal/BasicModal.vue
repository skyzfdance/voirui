<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
    <template #closeIcon v-if="!$slots.closeIcon">
      <ModalClose :canFullscreen="props.canFullscreen" :fullScreen="fullScreenRef" @cancel="handleCancel" @fullscreen="handleFullScreen" />
    </template>

    <template #title v-if="!$slots.title">
      <ModalHeader :help-message="props.helpMessage" :title="props.title" @dblclick="handleTitleDbClick" />
    </template>

    <template #footer v-if="!$slots.footer">
      <!-- 自定义底部 -->
    </template>
  </Modal>
</template>

<script setup lang="ts">
  import { computed, getCurrentInstance, ref, unref, useAttrs } from "vue"
  import { basicProps } from "./props"
  import { PREFIX_CLS } from "/@/config/project"
  import { useFullScreen } from "./hooks/useModalFullScreen"

  import { Modal } from "ant-design-vue"
  import ModalClose from "./components/ModalClose.vue"
  import ModalHeader from "./components/ModalHeader.vue"

  defineOptions({ inheritAttrs: false, name: "BasicModal" })

  const attrs = useAttrs()
  const instance = getCurrentInstance()
  const props = defineProps({ ...basicProps })
  const emits = defineEmits(["cancel", "register", "ok", "open-change"])
  const prefixCls = PREFIX_CLS + "-basic-modal"

  const openRef = ref(false)
  const getBindValue = computed((): Recordable => {
    return { ...attrs, ...props, open: unref(openRef) }
  })

  const modalMethods = {}

  instance && emits("register", modalMethods, instance.uid)

  const { handleFullScreen, fullScreenRef } = useFullScreen()

  /**
   * 关闭弹窗事件
   * @param e 
   */
  function handleCancel(e: MouseEvent) {
    console.log(e)
  }

  /**
   * 双击标题栏全屏状态修改
   * @param e 
   */
  function handleTitleDbClick(e: MouseEvent) {
    if (!props.canFullscreen) return
    e?.preventDefault?.()
    e?.stopPropagation?.()
    handleFullScreen(e)
    console.log(e)
  }
</script>
