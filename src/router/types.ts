/**
 * @file 路由相关类型定义
 */

import { RouteMeta, RouteRecordName, RouteRecordRaw } from "vue-router"

/**
 * 菜单类型定义
 */
export interface Menu {
  /**
   * 菜单名称
   */
  name: string

  /**
   * 菜单图标
   */
  icon?: string

  /**
   * 菜单路径
   */
  path: string

  /**
   * 菜单排序
   */
  orderNo?: number

  /**
   * 菜单权限
   */
  auths?: string[]

  /**
   * 是否隐藏菜单
   */
  hideMenu?: boolean

  /**
   * 子菜单
   */
  children?: Menu[]

  /**
   * 路由元信息
   */
  meta: Partial<RouteMeta>
}

type Component = () => Promise<typeof import("*.vue")>

 // @ts-ignore
export interface MergedRoute extends Omit<RouteRecordRaw, "meta"> {
 /**
   * 路由名称
   */
 name: RouteRecordName
 /**
  * 路由元信息
  */
 meta: RouteMeta
 /**
  * 路由组件
  */
 component?: Component
 /**
  * 子路由
  */
 children?: MergedRoute[]
}