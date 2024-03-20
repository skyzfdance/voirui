import { type MergedRoute } from "/@/router/types"
import { defineStore } from "pinia"
import { store } from ".."
import { filter } from "/@/utils/treeHelper"
import { asyncRoutes } from "/@/router/routes"
import { flatMultiLevelRoutes, routeToMenu } from "/@/router/menuHelper"

interface PermissionState {
  menuList: MergedRoute[];
  isDynamicAddedRoute: boolean; // 是否已经动态添加路由 
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
    }
  },
  actions: {
    setMenuList(list: MergedRoute[]) {
      this.menuList = list
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },

    /** 构建完整异步路由信息 */
    buildRoutesAction() {
      let routes: MergedRoute[] = []

      // TODO 这里需要从userStore中获取用户信息，用户信息里面返回对应的权限信息表
      const userAuths: string[] = []

      // 权限过滤
      const routeFilter = (route: MergedRoute) => {
        const { auths } = route.meta
        if (auths && auths.length) {
          return userAuths.some((auth) => auths.includes(auth))
        }
        return true
      }

      routes = filter(asyncRoutes, routeFilter) // 处理子级
      routes = routes.filter(routeFilter) // 处理顶级

      const menuList = routeToMenu(routes, true)
      menuList.sort((a, b) => (a.meta.orderNo || 0) - (b.meta.orderNo || 0)) // 排序

      this.setMenuList(menuList)

      routes = flatMultiLevelRoutes(routes);
      return routes
    },
  },
})

export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
