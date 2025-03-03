import type { NamePath, FormLabelAlign } from "ant-design-vue/es/form/interface"
import type { ColSize } from "ant-design-vue/es/grid"
import type { VNode } from "vue"
import type { ComponentProps } from "."
import type { Options } from "scroll-into-view-if-needed"

export interface ColProps {
  span: (StringConstructor | NumberConstructor)[]
  order: (StringConstructor | NumberConstructor)[]
  offset: (StringConstructor | NumberConstructor)[]
  push: (StringConstructor | NumberConstructor)[]
  pull: (StringConstructor | NumberConstructor)[]
  xs: string | number | ColSize
  sm: string | number | ColSize
  md: string | number | ColSize
  lg: string | number | ColSize
  xl: string | number | ColSize
  xxl: string | number | ColSize
  prefixCls: StringConstructor
  flex: (StringConstructor | NumberConstructor)[]
}

export type LayoutPoprs = "horizontal" | "vertical" | "inline"

export type ValidateTriggerPoprs = "change" | "blur" | "submit" | "none"

export type ValidateStatusPoprs = "success" | "warning" | "error" | "validating"

export type ComponentType = keyof ComponentProps

/** 表单组件 props */
export interface FormProps {
  /** 配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效) */
  colon?: boolean
  /** 设置表单组件禁用 */
  disabled?: boolean
  /** 隐藏所有表单项的必选标记 */
  hideRequiredMark?: boolean
  /** label 标签的文本对齐方式 */
  labelAlign?: FormLabelAlign
  /** labelCol	label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12} */
  labelCol?: ColProps
  /* 	label 标签的文本换行方式*/
  labelWrap?: boolean
  layout?: LayoutPoprs
  /* 表单名称，会作为表单字段 id 前缀使用 */
  name?: string
  /** noStyle	为 true 时不带样式，作为纯字段控件使用 */
  noStyle?: boolean
  /** 提交失败自动滚动到第一个错误字段 */
  scrollToFirstError?: boolean | Options
  /** 统一设置字段校验规则，触发错误提示时机 */
  validateTrigger?: ValidateTriggerPoprs | ValidateTriggerPoprs[]
  /** wrapperCol	需要为输入控件设置布局样式时，使用该属性，用法同 labelCol */
  wrapperCol?: ColProps
  /** 表单配置项 */
  schemas?: SchemaProps[]
  /** 是否紧凑表单，否则将默认使用 Antd From 表单 margin-bottom */
  compact: boolean
}

/** 单个表单域的配置项 */
export interface SchemaProps {
  /** 是否自动关联表单域，对于大部分情况都可以使用自动关联，如果不满足自动关联的条件，可以手动关联 */
  autoLink?: boolean
  /** 配合 label 属性使用，表示是否显示 label 后面的冒号 */
  colon?: boolean
  /** 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 */
  extra?: string | VNode
  /** 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用 */
  hasFeedback?: boolean
  /** 提示信息，如不设置，则会根据校验规则自动生成 */
  help?: string | VNode
  /** 设置子元素 label htmlFor 属性 */
  htmlFor?: string
  /** label 标签的文本 */
  label?: string | VNode
  /** 标签文本对齐方式  */
  labelAlign?: FormLabelAlign
  /** label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12} */
  labelCol?: ColProps
  /** 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的，也是表单绑定的 field 值，必须保证当前表单唯一 */
  name: NamePath
  /** 是否必填，如不设置，则会根据校验规则自动生成 */
  required?: boolean
  /** 配置提示信息 */
  tooltip?: string | string[] | VNode
  /** 当某一规则校验不通过时，是否停止剩下的规则的校验。 */
  validateFirst?: boolean
  /** 校验状态，如不设置，则会根据校验规则自动生成 */
  validateStatus?: ValidateStatusPoprs
  /** 设置字段校验的时机 */
  validateTrigger?: ValidateTriggerPoprs | ValidateTriggerPoprs[]
  /** 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol */
  wrapperCol?: ColProps
  /** 表单域的默认值 */
  defaultValue?: any
  /** 当前表单是否显示，v-if 能力  */
  ifShow?: boolean | (() => boolean) // TODO:
  /**  表单是否显示，v-show 能力 */
  show?: boolean | (() => boolean) // TODO
  /** 是否禁用 */
  disabled?: boolean | (() => boolean) // TODO
  /** 表单渲染组件 */
  component: ComponentType // TODO
  /** 组件渲染参数 */
  componentProps?: ComponentProps // TODO
}
