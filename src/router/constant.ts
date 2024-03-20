/**
 * @file 静态路由定义
 */

import { type MergedRoute } from "./types"

/** 基础路由框架 */
export const LAYOUT = () => import("/@/layouts/Main.vue")

export const ROOT_ROUTE: MergedRoute = {
  path: "/",
  name: "Root",
  redirect: "/dashboard",
  meta: { title: "Root" },
}

export const LOGIN_ROUTE: MergedRoute = {
  path: "/login",
  name: "Login",
  component: () => import("/@/views/system/login/Login.vue"),
  meta: { title: "登录页" },
}

export const REDIRECT_ROUTE: MergedRoute = {
  path: "/redirect",
  name: "Redirect",
  component: LAYOUT,
  meta: { title: "重定向", hideMenu: true, hideBreadcrumb: true },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: "RedirectPath",
      component: () => import("/@/views/system/Redirect.vue"),
      meta: { title: "重定向", hideBreadcrumb: true },
    },
  ],
}

export const PAGE_NOT_FOUND_ROUTE: MergedRoute = {
  path: "/:path(.*)*",
  name: "Error404",
  component: LAYOUT,
  meta: { title: "404", hideMenu: true, hideBreadcrumb: true },
  children: [
    {
      path: "/:path(.*)*",
      name: "Error404Path",
      component: () => import("/@/views/system/Exception.vue"),
      meta: { title: "404", hideBreadcrumb: true },
    },
  ],
}
