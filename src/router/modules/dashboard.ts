import { LAYOUT } from "../constant"
import { MergedRoute } from "../types"

const dashboard: MergedRoute = {
  path: "/dashboard",
  name: "Dashboard",
  component: LAYOUT,
  redirect: "/dashboard/analysis",
  meta: { orderNo: 1, icon: "icon-park-outline:workbench", title: "工作台", hideChildrenInMenu: true },
  children: [
    {
      path: "analysis",
      name: "Analysis",
      component: () => import("/@/views/dashboard/Dashboard.vue"),
      meta: { title: "工作台", hideMenu: true, hideBreadcrumb: true },
    },
  ],
}

export default dashboard
