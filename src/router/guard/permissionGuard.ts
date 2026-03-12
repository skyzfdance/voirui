import { type RouteRecordRaw, type Router } from "vue-router"
import { PAGE_NOT_FOUND_ROUTE } from "../constant"
import { usePermissionStoreWithOut } from "/@/stores/modules/permission"
import { useUserStoreWithOut } from "/@/stores/modules/user"
import { getCache } from "/@/utils/cache"
import { CacheTypeEnum } from "/@/enums/cacheEnum"

/**
 * 路由权限拦截器
 * @param router
 * @description 完整的权限验证流程：Token 验证 -> 用户信息获取 -> 路由构建 -> 权限过滤
 */
export function createPermissionGuard(router: Router): void {
  const permissionStore = usePermissionStoreWithOut()
  const userStore = useUserStoreWithOut()

  router.beforeEach(async (to, from) => {
    // 1. 获取 Token（优先 Pinia，其次本地缓存，防止刷新丢失）
    const token = userStore.getToken || getCache(CacheTypeEnum.TOKEN_KEY)

    // 2. 如果是登录页，特殊处理
    if (to.path === "/login") {
      // 如果已有 Token，说明已登录，重定向到首页
      if (token) {
        return { path: "/", replace: true }
      }
      // 没有 Token，直接放行到登录页
      return true
    }

    // 3. 没有 Token，跳转到登录页
    if (!token) {
      return { path: "/login", query: { redirect: to.fullPath } }
    }

    // 4. 如果动态路由已生成（刷新页面场景），直接放行
    if (permissionStore.getIsDynamicAddedRoute) {
      return true
    }

    // 5. 确保用户信息已加载（如果权限码为空，需要获取用户信息）
    if (!userStore.getUserAuths?.length) {
      try {
        // 调用接口获取用户信息和权限码
        await userStore.fetchUserInfo()
      } catch (error) {
        console.error("获取用户信息失败:", error)
        // 获取失败，清理状态并跳转登录页
        userStore.resetState()
        return { path: "/login", query: { redirect: to.fullPath } }
      }
    }

    // 6. 开始构建路由
    const routes = permissionStore.buildRoutesAction()

    // 7. 添加路由（防止重复添加）
    routes.forEach((item) => {
      if (item.name && router.hasRoute(item.name)) {
        router.removeRoute(item.name)
      }
      router.addRoute(item as RouteRecordRaw)
    })

    // 8. 添加 404 路由（必须放在最后）
    if (router.hasRoute(PAGE_NOT_FOUND_ROUTE.name as string)) {
      router.removeRoute(PAGE_NOT_FOUND_ROUTE.name as string)
    }
    router.addRoute(PAGE_NOT_FOUND_ROUTE as RouteRecordRaw)

    // 9. 标记路由已添加
    permissionStore.setDynamicAddedRoute(true)

    // 10. 重新导航到目标页面
    if (["Error404", "Error404Path"].includes(to.name as string)) {
      return { path: to.fullPath, replace: true, query: to.query }
    } else {
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      return to.path === redirect ? { ...to, replace: true } : { path: redirect }
    }
  })
}
