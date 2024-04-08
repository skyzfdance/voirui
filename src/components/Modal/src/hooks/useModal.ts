import { getCurrentInstance, nextTick, onUnmounted, ref, toRaw, unref, watchEffect } from "vue"
import type { ModalMethods, useInnerMethods, useInnerModalReturnType, useModalMethods, useModalReturnType } from "../typing"
import { isEqual } from "lodash-es"

/** 弹窗数据传输储存仓库 */
const dataTransfer = ref<{ [key: number]: any }>({})

export function useModal(): useModalReturnType {
  const modal = ref<ModalMethods | null>(null)
  const loaded = ref<boolean>(false) // 是否已加载
  const uid = ref<number>(0)

  function getInstance() {
    if (!unref(modal)) {
      throw new Error("useModal() 未注册！")
    }
    return unref(modal)
  }

  function register(modalMethod: ModalMethods, uuid: number) {
    if (!getCurrentInstance()) {
      throw new Error("useModal() 只能在 setup() 或 functional components 内部使用！")
    }
    uid.value = uuid
    onUnmounted(() => {
      modal.value = null
      loaded.value = false
      delete dataTransfer.value[uuid]
    })

    if (unref(loaded) && unref(modal) === modalMethod) return

    modal.value = modalMethod
    loaded.value = true
  }

  const methods: useModalMethods = {
    setModalProps: (props) => {
      getInstance()?.setModalProps(props)
    },
    openModal: (open = true, data) => {
      getInstance()?.setModalProps({ open })
      if (!data) return
      const uuid = unref(uid)

      // 这里不能用 深度克隆，因为会导致数据丢失，很有可能是因为数据中 function、 symbol、Date 等类型
      const cloneData = toRaw(data)

      if (!dataTransfer[uuid]) {
        dataTransfer.value[uuid] = cloneData
      } else {
        const oldData = dataTransfer.value[uuid]
        const equal = isEqual(oldData, cloneData)
        if (!equal) {
          dataTransfer.value[uuid] = cloneData
        }
      }
    },
    closeModal: () => {
      getInstance()?.setModalProps({ open: false })
    },
    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.()
    },
  }

  return [register, methods]
}

export function useModalInner(callbackFn?: (...arg) => void): useInnerModalReturnType {
  const modal = ref<ModalMethods | null>(null)
  const uid = ref<number>(0)

  const currentInstance = getCurrentInstance()

  function getInstance() {
    if (!unref(modal)) {
      throw new Error("useModalInner() 未注册！")
    }
    return unref(modal)
  }

  function register(modalMethod: ModalMethods, uuid: number) {
    onUnmounted(() => {
      modal.value = null
    })

    uid.value = uuid
    modal.value = modalMethod
    currentInstance?.emit("register", modalMethod, uuid)
  }

  watchEffect(() => {
    const data = dataTransfer.value[unref(uid)]
    if (!data) return
    if (callbackFn) {
      nextTick(() => {
        callbackFn(data)
      })
    }
  })

  const methods: useInnerMethods = {
    setModalProps: (props) => {
      getInstance()?.setModalProps(props)
    },
    closeModal: () => {
      getInstance()?.setModalProps({ open: false })
    },
    changeLoading: (loading) => {
      getInstance()?.setModalProps({ loading })
    },
    changeConfirmLoading: (loading) => {
      getInstance()?.setModalProps({ confirmLoading: loading })
    },
    redoModalHeight: () => {
      const callRedo = getInstance()?.redoModalHeight
      callRedo && callRedo()
    },
  }

  return [register, methods]
}
