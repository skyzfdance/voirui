import { type Router } from "vue-router"

import { Modal, message, notification } from "ant-design-vue"
import { createPermissionGuard } from "./permissionGuard"
import { createParamMenuGuard } from "./paramMenuGuard"

/**
 * 设置路由守卫，这里会同时处理多个，后续有需要可以自行添加
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router): void {
  createHttpGuard(router)
  createScrollGuard(router)
  createMessageGuard(router)
  createStateGuard(router)
  
  // 以下两个顺序不能变，必须先处理路由权限，再处理路由菜单
  createPermissionGuard(router)
  createParamMenuGuard(router)
}

/**
 * 页面跳转时，关闭所有未返回 http 请求
 * @param router
 */
function createHttpGuard(router: Router): void {
  // TODO 逻辑待实现
}

/**
 * 页面跳转后，滚动到顶部
 * @param router
 */
function createScrollGuard(router: Router): void {
  router.afterEach(() => {
    window.scrollTo(0, 0)
  })
}

/**
 * 路由跳转前，关闭所有弹窗
 * @param router
 */
function createMessageGuard(router: Router): void {
  router.beforeEach(() => {
    message.destroy() // Message 全局提示
    Modal.destroyAll() // Modal 对话框
    notification.destroy() // Notification 通知
  })
}

/**
 * 路由进入登录页面时，重置所有数据状态
 * @param router
 */
function createStateGuard(router: Router): void {
  router.afterEach((to) => {
    if (to.path === "/login") {
      // TODO 逻辑待实现
    }
  })
}
