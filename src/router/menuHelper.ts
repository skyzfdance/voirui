/**
 * @file 菜单相关处理工具
 */

import { type MergedRoute } from "./types"
import { cloneDeep, omit } from "lodash-es"
import { treeMap } from "/@/utils/treeHelper"
import { type RouteRecordRaw, createRouter, createWebHashHistory, type Router, type RouteRecordNormalized } from "vue-router"

/**
 * 路由转换为菜单列表
 * @param routeModList
 * @param routerMapping 是否需要映射路由，主要处理路由中的重定向
 */
export function routeToMenu(routeModList: MergedRoute[], routerMapping = false): MergedRoute[] {
  const cloneRouteModList = cloneDeep(routeModList)
  const routeList: MergedRoute[] = []

  cloneRouteModList.forEach((route: MergedRoute) => {
    if (routerMapping && route.meta.hideChildrenInMenu && typeof route.redirect === "string") {
      route.path = route.redirect
    }
    routeList.push(route)
  })

  const list = treeMap(routeList, {
    conversion: (node: MergedRoute) => {
      const { meta: { hideMenu = false } = {} } = node
      return {
        meta: node.meta,
        name: node.name,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      }
    },
  })
  
  return cloneDeep(list)
}

/**
 * 多级路由扁平化，转换为二级路由
 * @param routes
 * @returns
 */
export function flatMultiLevelRoutes(routes: MergedRoute[]): MergedRoute[] {
  const modules = cloneDeep(routes)

  for (let i = 0; i < modules.length; i++) {
    const element = modules[i]
    if (!isMultipleRoute(element)) continue
    promoteRouteLevel(element)
  }

  return modules
}

/**
 * 判定当前路由，是否为多级路由，超过2级就需要处理
 * @param routeModule
 * @returns
 */
function isMultipleRoute(routeModule: MergedRoute): boolean {
  if (!routeModule) return false
  if (!Reflect.has(routeModule, "children")) return false
  if (!routeModule.children?.length) return false
  let flag = false

  const children = routeModule.children

  for (let i = 0; i < children.length; i++) {
    const element = children[i]
    if (element.children?.length) {
      flag = true
      break
    }
  }

  return flag
}

/**
 * 路由等级提升
 * @param routeModule
 */
function promoteRouteLevel(routeModule: MergedRoute) {
  let router: Nullable<Router> = createRouter({
    routes: [routeModule as RouteRecordRaw],
    history: createWebHashHistory(),
  })

  const routes = router.getRoutes()

  addToChildren(routes, routeModule.children || [], routeModule)
  router = null

  // 删除原有的子路由，防止重复添加
  routeModule.children = routeModule.children?.map((item) => omit(item, ["children"]))
}

/**
 * 将所有子路由添加到二级路由
 * @param routes 
 * @param children 
 * @param routeModule 
 */
function addToChildren(routes: RouteRecordNormalized[], children: MergedRoute[], routeModule: MergedRoute) {
  for (let i = 0; i < children.length; i++) {
    const element = children[i]
    const route = routes.find((item) => item.name === element.name)
    if (!route) continue
    routeModule.children = routeModule.children || []
    const curRouteModule = routeModule.children.find((item) => item.name === route.name)
    if(!curRouteModule){
      routeModule.children.push(route as MergedRoute)
    }
    if(element.children?.length){
      addToChildren(routes, element.children, routeModule)
    }
  }
}
