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
  function hasPermission(value: string | string[], def = true): boolean {
    if (!value) return def

    const permissions = Array.isArray(value) ? value : [value]
  }

  return { hasPermission }
}
