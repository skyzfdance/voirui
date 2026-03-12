import { type MergedRoute } from "/@/router/types"
import { defineStore } from "pinia"
import { store } from ".."
import { filter } from "/@/utils/treeHelper"
import { asyncRoutes } from "/@/router/routes"
import { flatMultiLevelRoutes, routeToMenu } from "/@/router/menuHelper"
import { useUserStoreWithOut } from "/@/stores/modules/user"

interface PermissionState {
  menuList: MergedRoute[]
  isDynamicAddedRoute: boolean // 是否已经动态添加路由
}

export const usePermissionStore = defineStore("app-permission", {
  state: (): PermissionState => ({
    menuList: [], // 菜单列表
    isDynamicAddedRoute: false, // 是否已经动态添加路由
  }),
  getters: {
    getMenuList(state) {
      return state.menuList
    },
    getIsDynamicAddedRoute(state) {
      return state.isDynamicAddedRoute
    },
  },
  actions: {
    setMenuList(list: MergedRoute[]) {
      this.menuList = list
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },

    /**
     * 重置状态
     */
    resetState() {
      this.menuList = []
      this.isDynamicAddedRoute = false
    },

    /**
     * 构建完整异步路由信息
     * @description 从 userStore 获取权限码，根据权限过滤路由
     */
    buildRoutesAction() {
      const userStore = useUserStoreWithOut()
      const userAuths = userStore.getUserAuths || []

      let routes: MergedRoute[] = []

      // 权限过滤
      const routeFilter = (route: MergedRoute) => {
        const { auths } = route.meta
        if (auths && auths.length) {
          // 用户必须拥有路由所需的所有权限之一
          return userAuths.some((auth) => auths.includes(auth))
        }
        return true // 没有权限要求的路由，所有人都可访问
      }

      routes = filter(asyncRoutes, routeFilter) // 处理子级
      routes = routes.filter(routeFilter) // 处理顶级

      // 生成菜单列表
      const menuList = routeToMenu(routes, true)
      menuList.sort((a, b) => (a.meta.orderNo || 0) - (b.meta.orderNo || 0)) // 排序

      this.setMenuList(menuList)

      // 扁平化路由（处理多级路由）
      routes = flatMultiLevelRoutes(routes)
      return routes
    },
  },
})

export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
