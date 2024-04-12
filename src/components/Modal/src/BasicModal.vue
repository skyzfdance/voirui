<template>
  <Modal v-bind="getBindValue" :class="prefixCls" @cancel="handleCancel">
    <template #closeIcon v-if="!$slots.closeIcon">
      <ModalClose :canFullscreen="mergeProps.canFullscreen" :fullScreen="fullScreenRef" @cancel="handleCancel" @fullscreen="handleFullScreen" />
    </template>

    <template #title v-if="!$slots.title">
      <ModalHeader ref="modalHeaderRef" :helpMessage="mergeProps.helpMessage" :title="mergeProps.title" />
    </template>

    <template #footer v-if="!$slots.footer">
      <ModalFooter v-bind="getBindValue" @ok="(e) => emits('ok', e)" @cancel="handleCancel">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </ModalFooter>
    </template>

    <ModalWrapper
      ref="modalWrapperRef"
      :loading="mergeProps.loading"
      :loading-tips="mergeProps.loadingTip"
      :open="openRef"
      :min-height="mergeProps.minHeight"
      :full-screen="fullScreenRef"
      :height="mergeProps.height"
      :modal-footer-height="isUndefined(footer) ? 65 : 0"
      @height-change="(height: number) => emits('height-change', height)"
      @ext-height="(height: number) => (extHeightRef = height)"
    >
      <slot></slot>
    </ModalWrapper>

    <template #[item]="data" v-for="item in Object.keys(omit($slots, 'default'))">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>

<script setup lang="ts">
  import type { ModalMethods, ModalProps } from "./typing"
  import { computed, getCurrentInstance, nextTick, ref, toRefs, unref, useAttrs, watch, watchEffect } from "vue"
  import { basicProps } from "./props"
  import { buildClass } from "/@/hooks/useClass"
  import { isFunction, merge, omit, isUndefined } from "lodash-es"
  import { useFullScreen } from "./hooks/useModalFullScreen"
  import { useModalDrag } from "./hooks/useModalDrag"

  import { Modal } from "ant-design-vue"
  import ModalClose from "./components/ModalClose.vue"
  import ModalHeader from "./components/ModalHeader.vue"
  import ModalFooter from "./components/ModalFooter.vue"
  import ModalWrapper from "./components/ModalWrapper.vue"

  defineOptions({ inheritAttrs: false, name: "BasicModal" })

  const attrs = useAttrs()
  const instance = getCurrentInstance()
  const props = defineProps({ ...basicProps })
  const emits = defineEmits(["cancel", "register", "ok", "open-change", "update:open", "fullscreen", "height-change"])
  const prefixCls = buildClass("basic-modal")

  const modalMethods: ModalMethods = {
    setModalProps,
    redoModalHeight: () => {
      nextTick(() => {
        unref(modalWrapperRef)?.setModalHeight()
      })
    },
  }

  instance && emits("register", modalMethods, instance.uid)

  const { handleFullScreen: handleFullScreenInner, fullScreenRef } = useFullScreen()

  const openRef = ref(false)
  const propsRef = ref<Partial<ModalProps> | null>(null)
  const modalWrapperRef = ref<InstanceType<typeof ModalWrapper> | null>(null)
  const modalHeaderRef = ref<InstanceType<typeof ModalHeader> | null>(null)

  const extHeightRef = ref(0)

  const mergeProps = computed(() => ({ ...props, ...(unref(propsRef) || {}) }))

  const wrapClassName = computed(() => {
    const clsName = unref(mergeProps).wrapClassName || ""
    return unref(fullScreenRef) ? `fullscreen-modal ${clsName}` : clsName
  })

  const getBindValue = computed((): Recordable => {
    const attr = { ...attrs, ...props, ...unref(propsRef), open: unref(openRef) }
    attr.wrapClassName = `${attr?.wrapClassName ?? ""} ${unref(wrapClassName)}` + buildClass("basic-modal-wrap")

    if (unref(fullScreenRef)) {
      return omit(attr, ["height", "title"])
    }

    return omit(attr, ["title"])
  })

  watchEffect(() => {
    openRef.value = !!props.open
    fullScreenRef.value = !!props.defaultFullscreen
  })

  watch(
    () => unref(openRef),
    (val) => {
      emits("open-change", val)
      emits("update:open", val)
      nextTick(() => {
        if (val && unref(modalWrapperRef)) {
          unref(modalWrapperRef)?.setModalHeight()
        }
      })
    },
    { immediate: true },
  )

  useModalDrag({ open: openRef, draggable: toRefs(props).draggable, destroyOnClose: toRefs(props).destroyOnClose })

  /**
   * 关闭弹窗事件
   * @param e
   */
  async function handleCancel(e: MouseEvent) {
    e.stopPropagation()

    if (props.customClose && isFunction(props.customClose)) {
      const isClose: boolean = await props.customClose()
      openRef.value = !isClose
      return
    }

    openRef.value = false
    emits("cancel", e)

    await nextTick()

    if (props.afterClose && isFunction(props.afterClose)) {
      props.afterClose()
    }
  }

  /**
   * 更新弹窗属性
   * @param props
   */
  function setModalProps(props: Partial<ModalProps>) {
    propsRef.value = merge(unref(propsRef) || {}, props)
    if (Reflect.has(props, "open")) {
      openRef.value = !!props.open
    }
    if (Reflect.has(props, "defaultFullscreen")) {
      fullScreenRef.value = !!props.defaultFullscreen
    }
  }

  /**
   * 全屏事件处理
   * @param e
   */
  function handleFullScreen(e: MouseEvent) {
    handleFullScreenInner(e)
    emits("fullscreen")
  }
</script>
