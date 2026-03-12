/**
 * @file 权限指令
 * @module directives/permission
 * @description v-permission 指令，用于控制按钮级别的权限
 */

import { type Directive } from "vue"
import { useUserStoreWithOut } from "/@/stores/modules/user"

/**
 * 权限指令
 * @usage 
 * ```vue
 * <!-- 单个权限 -->
 * <button v-permission="'product:edit'">编辑</button>
 * 
 * <!-- 多个权限（满足其一即可） -->
 * <button v-permission="['product:edit', 'product:delete']">操作</button>
 * ```
 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStoreWithOut()
    const userAuths = userStore.getUserAuths

    if (value) {
      // 支持单个权限或权限数组
      const requiredPermissions = Array.isArray(value) ? value : [value]
      
      // 检查是否拥有任一权限
      const hasPermission = requiredPermissions.some((perm) =>
        userAuths.includes(perm)
      )

      // 如果没有权限，移除元素
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
