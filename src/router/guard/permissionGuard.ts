import { type RouteRecordRaw, type Router } from "vue-router"
import { PAGE_NOT_FOUND_ROUTE } from "../constant"
import { usePermissionStoreWithOut } from "/@/stores/modules/permission"

/**
 * 路由权限拦截器
 * @param router
 */
export function createPermissionGuard(router: Router): void {
  const permissionStore = usePermissionStoreWithOut()

  router.beforeEach((to, from, next) => {

    // TOD
    // if (from.path === ROOT_ROUTE.path && to.path === "/dashboard") {
    //   next("/dashboard")
    //   return
    // }

    // TODO 缺少token验证 跳转到 登录页

    // TODO 缺少权限验证 跳转到 403页面


    // 如果是前往登录页，直接放行
    if(from.path === "/login"){
      // TODO 清理掉所有的缓存数据
      next();
      return;
    }


    // 如果动态路由已生成，比如说刷新页面，直接放行
    if (permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }

    // 重头开始构建路由
    const routes = permissionStore.buildRoutesAction()

    routes.forEach((item) => {
      router.addRoute(item as RouteRecordRaw)
    })

    // 添加404页面，必须放在最后去处理
    router.addRoute(PAGE_NOT_FOUND_ROUTE as RouteRecordRaw)

    // 当前路由已经添加完成，标记为true
    permissionStore.setDynamicAddedRoute(true)

    // 重构路由后，重新跳转到目标路由，防止进入 404 页面
    if (["Error404", "Error404Path"].includes(to.name as string)) {
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      next(nextData)
    }
  })
}
