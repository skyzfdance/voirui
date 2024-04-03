import type { ButtonProps } from "ant-design-vue/es/button/buttonTypes"
import { type VNode, type CSSProperties } from "vue"

export interface ModalProps {
  /** Modal 完全关闭后的回调 */
  afterClose: () => void
  /** bodyStyle	Modal body 样式 */
  bodyStyle?: CSSProperties
  /** cancel 按钮 props */
  cancelButtonProps?: ButtonProps
  /** 取消按钮文字 */
  cancelText?: string
  /** 垂直居中展示 Modal */
  centered?: boolean
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean
  /** 自定义关闭图标 */
  closeIcon?: VNode
  /** 确定按钮 loading */
  confirmLoading?: boolean
  /** destroyOnClose	关闭时销毁 Modal 里的子元素 */
  destroyOnClose?: boolean
  /** 底部内容，当不需要默认底部按钮时，可以设为 :footer="null" */
  footer?: VNode | null
  /** 指定 Modal 挂载的 HTML 节点 */
  getContainer?: (instance: any) => HTMLElement | null
  /** 是否支持键盘 esc 关闭 */
  keyboard?: boolean
  /** 是否展示遮罩 */
  mask?: boolean
  /** 点击蒙层是否允许关闭 */
  maskClosable?: boolean
  /** 遮罩样式 */
  maskStyle?: CSSProperties
  /** ok 按钮 props */
  okButtonProps?: ButtonProps
  /** 确认按钮文字 */
  okText?: string
  /** 确认按钮类型 */
  okType?: string
  /** 标题 */
  title?: string | VNode
  /** 对话框是否可见 */
  open?: boolean
  /** 宽度 */
  width?: string | number
  /** 对话框外层容器的类名 */
  wrapClassName?: string
  /** 设置 Modal 的 z-index */
  zIndex?: number
  /** 是否支持拖拽 */
  draggable?: boolean
  /** 是否支持全屏 */
  canFullscreen?: boolean
  /** 是否默认全屏 */
  defaultFullscreen?: boolean
  /** 标题提示信息 */
  helpMessage?: string | string[]
  /** 是否显示加载状态 */
  loading?: boolean
  /** 加载状态提示信息 */
  loadingTip?: string
  /** 自定义关闭事件，根据返回状态，判定当前弹窗是否关闭 */
  customClose?: () => Promise<boolean>
  /** 是否显示确认按钮 */
  showOkBtn?: boolean
  /** 是否显示取消按钮 */
  showCancelBtn?: boolean
}
/**
 * 弹窗基础方法
 */
export interface ModalMethods {
  setModalProps: (props: Partial<ModalProps>) => void
}

/**
 * 注册弹窗方法，提供给 useModal 使用
 */
export interface useModalMethods extends ModalMethods {
  /**
   * @param open
   * @param data 传递给弹窗内部的数据
   * @returns
   */
  openModal: (open?: boolean, data?: any) => void
  closeModal: () => void
}

/**
 * 弹窗内部方法，提供给 useInnerModal 使用
 */
export interface useInnerMethods extends ModalMethods {
  closeModal: () => void
  changeLoading: (loading: boolean) => void
  changeConfirmLoading: (loading: boolean) => void
  redoModalHeight: () => void
}

export type RegisterFn = (modalMethod: ModalMethods, uuid: number) => void

export type useModalReturnType = [RegisterFn, useModalMethods]

export type useInnerModalReturnType = [RegisterFn, useInnerMethods]
