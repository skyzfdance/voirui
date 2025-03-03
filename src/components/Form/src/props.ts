/**
 * @file form props 定义
 * @module src/components/Form/src/props.ts
 */

import { type FormLabelAlign } from "ant-design-vue/es/form/interface"
import type { LayoutPoprs, ColProps, ValidateTriggerPoprs, SchemaProps } from "./types/props"
import type { Options } from "scroll-into-view-if-needed"

const defaultProps = {
  /** 配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效) */
  colon: { type: Boolean, default: true },
  /** 设置表单组件禁用 */
  disabled: { type: Boolean, default: false },
  /** 隐藏所有表单项的必选标记 */
  hideRequiredMark: { type: Boolean, default: false },
  /** label 标签的文本对齐方式 */
  labelAlign: { type: String as PropType<FormLabelAlign>, default: "right" },
  /** labelCol	label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12} */
  labelCol: { type: Object as PropType<ColProps>, default: () => null },
  /* 	label 标签的文本换行方式*/
  labelWrap: { type: Boolean, default: true },
  layout: { type: String as PropType<LayoutPoprs>, default: "horizontal" },
  /* 表单名称，会作为表单字段 id 前缀使用 */
  name: { type: String },
  /** noStyle	为 true 时不带样式，作为纯字段控件使用 */
  noStyle: { type: Boolean, default: false },
  /** 提交失败自动滚动到第一个错误字段 */
  scrollToFirstError: { type: [Boolean, Object] as PropType<boolean | Options>, default: false },
  /** 统一设置字段校验规则，触发错误提示时机 */
  validateTrigger: { type: [String, Array] as PropType<ValidateTriggerPoprs | ValidateTriggerPoprs[]>, default: "change" },
  /** wrapperCol	需要为输入控件设置布局样式时，使用该属性，用法同 labelCol */
  wrapperCol: { type: Object as PropType<ColProps> },
}

export const formProps = {
  /** 表单配置项  */
  schemas: { type: Array as PropType<SchemaProps[]>, default: () => [] },
  /** 是否紧凑表单，否则将默认使用 Antd From 表单 margin-bottom */
  compact: { type: Boolean, default: false },
}

export const basicProps = Object.assign({}, defaultProps, formProps)
