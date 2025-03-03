/**
 * @file usePermission.ts
 * @module hooks/usePermission
 * @description 页面权限相关的自定义 hooks
 */

export function usePermission() {
  /**
   * 动态判定当前用户是否有权限
   * @param value 权限值
   * @param def 默认是否有权限
   * @returns
   */
  function hasPermission(value: string | string[], def = true) {
    if (!value) return def

    const permissions = Array.isArray(value) ? value : [value]
    
    if (!permissions.length) return def

    return permissions.some((i) => {
      const permission = i.trim()
      if (permission.startsWith("!")) {
        return !hasPermission(permission.slice(1))
      }
      return true
    })
  }

  return { hasPermission }
}
