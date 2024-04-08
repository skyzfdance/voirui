import type { ButtonProps } from "ant-design-vue/es/button/buttonTypes"
import { type VNode, type CSSProperties } from "vue"

const defaultProps = {
  /** Modal 完全关闭后的回调 */
  afterClose: { type: Function as PropType<() => void> },
  /** bodyStyle	Modal body 样式 */
  bodyStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  /** cancel 按钮 props */
  cancelButtonProps: { type: Object as PropType<ButtonProps> },
  /** 取消按钮文字 */
  cancelText: { type: String, default: "取消" },
  /** 垂直居中展示 Modal */
  centered: { type: Boolean, default: false },
  /** 是否显示右上角的关闭按钮 */
  closable: { type: Boolean, default: true },
  /** 自定义关闭图标 */
  closeIcon: { type: Object as PropType<VNode> },
  /** 确定按钮 loading */
  confirmLoading: { type: Boolean, default: false },
  /** destroyOnClose	关闭时销毁 Modal 里的子元素 */
  destroyOnClose: { type: Boolean, default: false },
  /** 底部内容，当不需要默认底部按钮时，可以设为 :footer="null" */
  footer: { type: Object as PropType<VNode> },
  /** 指定 Modal 挂载的 HTML 节点 */
  getContainer: { type: Function as PropType<() => HTMLElement | null>, default: () => document.body },
  /** 是否支持键盘 esc 关闭 */
  keyboard: { type: Boolean, default: true },
  /** 是否展示遮罩 */
  mask: { type: Boolean, default: true },
  /** 点击蒙层是否允许关闭 */
  maskClosable: { type: Boolean, default: true },
  /** 遮罩样式 */
  maskStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  /** ok 按钮 props */
  okButtonProps: { type: Object as PropType<ButtonProps> },
  /** 确认按钮文字 */
  okText: { type: String, default: "确定" },
  /** 确认按钮类型 */
  okType: { type: String, default: "primary" },
  /** 标题 */
  title: { type: String },
  /** 对话框是否可见 */
  open: { type: Boolean, default: false },
  /** 宽度 */
  width: { type: [String, Number] as PropType<string | number>, default: 520 },
  /** 对话框外层容器的类名 */
  wrapClassName: { type: String },
  /** 设置 Modal 的 z-index */
  zIndex: { type: Number, default: 1000 },
}

const modalProps = {
  /** 是否支持拖拽 */
  draggable: { type: Boolean, default: true },
  /** 是否支持全屏 */
  canFullscreen: { type: Boolean, default: true },
  /** 是否默认全屏 */
  defaultFullscreen: { type: Boolean, default: false },
  /** 标题提示信息 */
  helpMessage: { type: [String, Array] as PropType<string | string[]>, default: "" },
  /** 是否显示加载状态 */
  loading: { type: Boolean, default: false },
  /** 加载状态提示信息 */
  loadingTip: { type: String, default: "加载中..." },
  /** 自定义关闭事件，根据返回状态，判定当前弹窗是否关闭 */
  customClose: { type: Function as PropType<() => Promise<boolean>> },
  /** 是否显示确认按钮 */
  showOkBtn: { type: Boolean, default: true },
  /** 是否显示取消按钮 */
  showCancelBtn: { type: Boolean, default: true },
  /** 最小高度 */
  minHeight: { type: [String, Number] as PropType<string | number> },
  /** 固定高度 */
  height: { type: [String, Number] },
}

export const basicProps = Object.assign({}, defaultProps, modalProps)
