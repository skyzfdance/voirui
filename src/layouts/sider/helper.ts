import { usePermissionStoreWithOut } from "/@/stores/modules/permission"
import { type MergedRoute } from "/@/router/types"

/**
 * 获取当前权限下的菜单列表
 * @returns
 */
export function getCurMenus(): MergedRoute[] {
  const permissionStore = usePermissionStoreWithOut()
  return permissionStore.getMenuList.filter((item) => !item.meta.hideMenu)
}

/**
 * 转换当前菜单为，修改其完整路由地址
 * @param menus
 * @param parentPath 上级路由地址
 * @returns
 */
export function joinParentPath(menus: MergedRoute[], parentPath = "") {
  const updatedMenus: MergedRoute[] = []

  for (let i = 0; i < menus.length; i++) {
    const menu = { ...menus[i] } // 创建一个新的菜单对象以保持原始菜单不变
    if (!menu.path.startsWith("/")) {
      menu.path = `${parentPath}/${menu.path}`
    }
    if (menu.children?.length) {
      menu.children = joinParentPath(menu.children, menu.path)
    }
    updatedMenus.push(menu)
  }

  return updatedMenus
}
