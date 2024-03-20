import { LAYOUT } from "../constant"
import { MergedRoute } from "../types"

const commodity: MergedRoute = {
  path: "/commodity",
  name: "Commodity",
  component: LAYOUT,
  meta: { orderNo: 4, title: "产品管理", icon: "icon-park-outline:commodity" },
  children: [
    {
      path: "pro-category",
      name: "ProCategory",
      component: () => import("/@/views/commodity/ProCategory/ProCategory.vue"),
      meta: { orderNo: 1, title: "产品分类" },
    },
    {
      path: "product",
      name: "Product",
      component: () => import("/@/views/commodity/Product/Product.vue"),
      meta: { orderNo: 2, title: "产品列表" },
      children: [],
    },
  ],
}

export default commodity
