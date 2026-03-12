import { type Router } from "vue-router"
import { Modal, message, notification } from "ant-design-vue"
import { createPermissionGuard } from "./permissionGuard"
import { useUserStoreWithOut } from "/@/stores/modules/user"
import { usePermissionStoreWithOut } from "/@/stores/modules/permission"
import { clearCache } from "/@/utils/cache"
import { http } from "/@/utils/http/index"

/**
 * 设置路由守卫
 * @param router 路由实例
 * @description 统一配置所有路由守卫，按执行时机分组管理
 */
export function setupRouterGuard(router: Router): void {
  // beforeEach 守卫：页面跳转前的清理工作
  createBeforeEachGuard(router)

  // afterEach 守卫：页面跳转后的处理工作
  createAfterEachGuard(router)

  // 权限守卫（核心逻辑，最后注册确保在其他守卫之后执行）
  createPermissionGuard(router)
}

/**
 * 路由跳转前置守卫
 * @description 统一处理页面跳转前的清理工作：
 * - 取消未完成的 HTTP 请求
 * - 关闭所有弹窗和消息提示
 */
function createBeforeEachGuard(router: Router): void {
  router.beforeEach(() => {
    // 取消所有未完成的 HTTP 请求，防止内存泄漏
    http.cancelAll()

    // 清理全局 UI 组件
    message.destroy()
    Modal.destroyAll()
    notification.destroy()
  })
}

/**
 * 路由跳转后置守卫
 * @description 统一处理页面跳转后的工作：
 * - 滚动到页面顶部
 * - 进入登录页时重置所有状态
 */
function createAfterEachGuard(router: Router): void {
  router.afterEach((to) => {
    // 滚动到页面顶部
    window.scrollTo(0, 0)

    // 进入登录页时清理所有状态（用于退出登录场景）
    if (to.path === "/login") {
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()

      userStore.resetState()
      permissionStore.resetState()
      clearCache()
    }
  })
}
