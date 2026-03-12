/**
 * @file 权限 Hooks
 * @module hooks/usePermission
 * @description 用于在组件中判断按钮权限
 */

import { useUserStoreWithOut } from "/@/stores/modules/user"

/**
 * 权限判断 Hooks
 * @returns 包含权限判断方法的对象
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { hasPermission } = usePermission()
 * </script>
 * 
 * <template>
 *   <!-- 单个权限 -->
 *   <button v-if="hasPermission('product:edit')">编辑</button>
 *   
 *   <!-- 多个权限（满足其一即可） -->
 *   <button v-if="hasPermission(['product:edit', 'product:delete'])">操作</button>
 *   
 *   <!-- 在 JS 中使用 -->
 *   <script setup lang="ts">
 *     const { hasPermission } = usePermission()
 *     
 *     const handleAction = () => {
 *       if (!hasPermission('product:edit')) {
 *         message.error('没有操作权限')
 *         return
 *       }
 *       // 执行操作...
 *     }
 *   </script>
 * ```
 */
export function usePermission() {
  const userStore = useUserStoreWithOut()

  /**
   * 判断是否拥有某个权限
   * @param code - 权限码或权限码数组
   * @returns 是否拥有权限
   */
  const hasPermission = (code: string | string[]): boolean => {
    const codes = Array.isArray(code) ? code : [code]
    const userAuths = userStore.getUserAuths
    
    // 检查是否拥有任一权限
    return codes.some((c) => userAuths.includes(c))
  }

  /**
   * 判断是否拥有所有指定权限
   * @param codes - 权限码数组
   * @returns 是否拥有所有权限
   */
  const hasAllPermissions = (codes: string[]): boolean => {
    const userAuths = userStore.getUserAuths
    return codes.every((c) => userAuths.includes(c))
  }

  return {
    hasPermission,
    hasAllPermissions,
  }
}
