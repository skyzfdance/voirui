/**
 * @file 组件类型定义
 * @module src/components/Form/src/types/index.ts
 */

/** Antd 默认表单 ComponentProps 类型定义 */
export interface AntdComponentProps {
  AutoComplete: InstanceType<(typeof import("ant-design-vue/es/auto-complete"))["default"]>
  Cascader: InstanceType<(typeof import("ant-design-vue/es/cascader"))["default"]>
  Checkbox: InstanceType<(typeof import("ant-design-vue/es/checkbox"))["default"]>
  CheckboxGroup: InstanceType<(typeof import("ant-design-vue/es/checkbox"))["CheckboxGroup"]>
  DatePicker: InstanceType<(typeof import("ant-design-vue/es/date-picker"))["default"]>
  RangePicker: InstanceType<(typeof import("ant-design-vue/es/date-picker"))["RangePicker"]>
  Input: InstanceType<(typeof import("ant-design-vue/es/input"))["default"]>
  InputGroup: InstanceType<(typeof import("ant-design-vue/es/input"))["InputGroup"]>
  InputPassword: InstanceType<(typeof import("ant-design-vue/es/input"))["InputPassword"]>
  InputSearch: InstanceType<(typeof import("ant-design-vue/es/input"))["InputSearch"]>
  InputTextArea: InstanceType<(typeof import("ant-design-vue/es/input"))["Textarea"]>
  InputNumber: InstanceType<(typeof import("ant-design-vue/es/input-number"))["default"]>
  Mentions: InstanceType<(typeof import("ant-design-vue/es/mentions"))["default"]>
  Radio: InstanceType<(typeof import("ant-design-vue/es/radio"))["default"]>
  RadioGroup: InstanceType<(typeof import("ant-design-vue/es/radio"))["RadioGroup"]>
  RadioButton: InstanceType<(typeof import("ant-design-vue/es/radio"))["RadioButton"]>
  Rate: InstanceType<(typeof import("ant-design-vue/es/rate"))["default"]>
  Select: InstanceType<(typeof import("ant-design-vue/es/select"))["default"]>
  Slider: InstanceType<(typeof import("ant-design-vue/es/slider"))["default"]>
  Switch: InstanceType<(typeof import("ant-design-vue/es/switch"))["default"]>
  TimePicker: InstanceType<(typeof import("ant-design-vue/es/time-picker"))["default"]>
  TimeRangePicker: InstanceType<(typeof import("ant-design-vue/es/time-picker"))["TimeRangePicker"]>
  Transfer: InstanceType<(typeof import("ant-design-vue/es/transfer"))["default"]>
  TreeSelect: InstanceType<(typeof import("ant-design-vue/es/tree-select"))["default"]>
  Divider: InstanceType<(typeof import("ant-design-vue/es/divider"))["default"]>
}

/** 自定义表单组件 ComponentProps 类型定义 */
export interface CustomComponentProps {}

/** 全体组件consolr */
export type ComponentProps = AntdComponentProps & CustomComponentProps
