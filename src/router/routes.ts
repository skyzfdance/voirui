/**
 * @file 路由数据处理
 */

import { type MergedRoute } from "./types"
import { LOGIN_ROUTE, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, ROOT_ROUTE } from "./constant"

interface Module extends Object {
  default: MergedRoute
  [Symbol.toStringTag]: string
}

// 批量导入 modules 中的路由
const routeModuleList: MergedRoute[] = []
const modules: Record<string, Module> = import.meta.glob("./modules/*.ts", { eager: true })
Object.keys(modules).forEach((key: string) => {
  const mod = modules[key].default || {}
  const mods = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...mods)
})

/** 异步路由，需要动态加载的 */
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

/** 静态路由 */
export const baseRoutes: MergedRoute[] = [ROOT_ROUTE, LOGIN_ROUTE, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE]
