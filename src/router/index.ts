import { type RouteRecordName, type RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router"
import { type MergedRoute } from "./types"
import { baseRoutes } from "./routes"
import { type App } from "vue";

/** 路由白名单，为后续重置路由服务 */
const WHITE_NAME_LIST: RouteRecordName[] = []
;(function getRouteNames(routes: MergedRoute[]) {
  routes.forEach((route) => {
    WHITE_NAME_LIST.push(route.name)
    if (route.children) {
      getRouteNames(route.children)
    }
  })
})(baseRoutes)

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: baseRoutes as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * 重置路由，移除所有动态添加的路由
 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export function setupRouter(app: App) {
  app.use(router)
}
