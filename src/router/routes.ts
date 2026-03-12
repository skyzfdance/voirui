/**
 * @file 路由数据处理
 */

import { type MergedRoute } from "./types"
import { LOGIN_ROUTE, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, ROOT_ROUTE } from "./constant"

/**
 * 批量导入 modules 目录下的所有路由模块
 * 使用 import.meta.glob 自动收集所有路由配置
 */
function loadRouteModules(): MergedRoute[] {
  const modules = import.meta.glob<{ default: MergedRoute | MergedRoute[] }>("./modules/*.ts", { eager: true })

  return Object.values(modules).flatMap((mod) => {
    const route = mod.default
    return Array.isArray(route) ? route : [route]
  })
}

/** 动态路由模块列表 */
const routeModuleList = loadRouteModules()

/** 异步路由，需要动态加载的（包含业务模块和404兜底） */
export const asyncRoutes: MergedRoute[] = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

/** 静态路由（基础框架路由，无需权限即可访问） */
export const baseRoutes: MergedRoute[] = [ROOT_ROUTE, LOGIN_ROUTE, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE]
