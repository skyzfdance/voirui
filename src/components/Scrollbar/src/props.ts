import { type CSSProperties } from "vue"

export const defaultProps = {
  /** 滚动区高度 */
  height: { type: [String, Number] },
  /** 滚动区最大高度 */
  maxHeight: { type: [String, Number] },
  /** 是否使用浏览器原生滚动条 */
  native: { type: Boolean, default: false },
  /** 包裹容器的自定义样式 */
  wrapStyle: { type: Object as PropType<CSSProperties>, default: () => {} },
  /** 包裹容器的自定义类名 */
  wrapClass: { type: [String, Array] as PropType<string | string[]>, default: "" },
  /** 视图的自定义样式 */
  viewStyle: { type: Object as PropType<CSSProperties>, default: () => {} },
  /** 视图的自定义类名 */
  viewClass: { type: [String, Array] as PropType<string | string[]>, default: "" },
  /** 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能 */
  noresize: { type: Boolean, default: false },
  /** 视图的元素标签 */
  tag: { type: String, default: "div" },
  /** 滚动条总是显示 */
  always: { type: Boolean, default: false },
  /** 滚动条最小尺寸 */
  minSize: { type: Number, default: 20 },
  /** 视图ID */
  id: { type: String, default: "" },
}
