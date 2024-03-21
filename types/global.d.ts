/**
 * @file types/global.d.ts
 * @module types/global
 * @description: Global type declaration
 */

import type { PropType as VuePropType } from "vue"

declare global {
  declare type Nullable<T> = T | null | undefined

  /** defineEmits */
  declare type EmitType = (event: string, ...args: any[]) => void

  declare type PropType<T> = VuePropType<T>

  declare type Recordable<T = any> = Record<string, T>

  /**
   * 对象类型 T 中的所有属性变成可选，并且支持无限递归
   * @example
   * DeepPartial<T>: 这是一个泛型类型，其中 T 是要进行深度部分类型的原始类型。
   * { [P in keyof T]?: DeepPartial<T[P]>; }: 这是一个映射类型（Mapped Type），通过使用 TypeScript 中的映射类型语法，遍历 T 类型的所有属性，并将它们变成可选的。
   * * keyof T: 表示获取 T 类型的所有属性名组成的联合类型。
   * * P in keyof T: 使用映射类型语法，遍历 T 的属性，P 表示每个属性名。
   * * [P in keyof T]?: DeepPartial<T[P]>: 表示将 T 的每个属性变成可选的，并且属性的值的类型为 DeepPartial<T[P]>，这就是递归地应用了 DeepPartial 类型。
   */
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
}
