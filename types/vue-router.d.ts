/**
 * @file vue-router.d.ts
 * @module types/vue-router
 * @description Vue Router type declaration
 */

export {}

declare module "vue-router" {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    /**
     * 路由名称
     */
    title: string;

    /**
     * 路由排序，只针对于当前层级
     */
    orderNo?: number;

    /** 
     * 路由图标
     */
    icon?: string;

    /**
     * 路由权限
     */
    auths?: string[];

    /**
     * 是否在面包屑中隐藏当前路由
     */
    hideBreadcrumb?: boolean;
    
    /**
     * 是否在菜单中隐藏子路由
     */
    hideChildrenInMenu?: boolean;

    /**
     * 是否在菜单中隐藏当前路由
     */
    hideMenu?: boolean;

    /**
     * 当前激活的菜单高亮，一般用于 hideMenu = true 配合使用
     */
    currentActiveMenu?: string;
  }
}
