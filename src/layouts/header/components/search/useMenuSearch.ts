import type { Menu, MergedRoute } from "/@/router/types"
import type { ChangeEvent } from "ant-design-vue/es/_util/EventInterface"
import { useDebounceFn, useScroll } from "@vueuse/core"
import { type Ref, nextTick, ref, unref, onBeforeMount } from "vue"
import { useGo } from "/@/hooks/usePage"
import { filter } from "/@/utils/treeHelper"
import { cloneDeep } from "lodash-es"

import { usePermissionStoreWithOut } from "/@/stores/modules/permission"

interface SearchResult {
  name: string
  path: string
  icon?: string
}

/**
 * 转移字符，防止正则表达式出错
 * @param c 需要转换的字符
 * @returns
 */
function transform(c: string): string {
  const code = ["$", "(", ")", "*", "+", ".", "[", "]", "?", "\\", "^", "{", "}", "|"]
  return code.includes(c) ? `\\${c}` : c
}

/**
 * 创建搜索关键字正则表达式
 * @param key 搜索关键字
 * @returns
 */
function createSearchReg(key: string) {
  const keys = [...key].map((item) => transform(item))
  const str = ["", ...keys, ""].join(".*")
  return new RegExp(str)
}

function getCurMenus(): MergedRoute[] {
  const permissionStore = usePermissionStoreWithOut()
  return permissionStore.getMenuList.filter((item) => !item.meta.hideMenu)
}

function createMenus(menus: MergedRoute[] | Menu[], parentPath = ""): Menu[] {
  const updatedMenus: Menu[] = []

  for (let i = 0; i < menus.length; i++) {
    const menu = { ...menus[i] }
    if (!menu.path.startsWith("/")) {
      menu.path = `${parentPath}/${menu.path}`
    }
    if (menu.children?.length) {
      menu.children = createMenus(menu.children, menu.path)
    }

    const newMenu = {
      name: menu.meta.title || (menu.name as string),
      icon: menu.meta.icon,
      path: menu.path,
      orderNo: menu.meta.orderNo,
      auths: menu.meta.auths,
      hideMenu: menu.meta.hideMenu,
      children: menu?.children || [],
      meta: menu.meta,
    }

    updatedMenus.push(newMenu as Menu)
  }

  return updatedMenus
}

/**
 * 检索菜单执行器
 * @param scrollWrap 滚动容器
 * @param emits 父级组件事件
 * @returns
 */
export function useMenuSearch(scrollWrap: Ref<Nullable<HTMLElement>>, emits: EmitType) {
  const activeIndex = ref(-1) // 当前选中的结果索引

  const handleSearch = useDebounceFn(search, 200)
  const go = useGo()

  const keyword = ref("")
  const searchResult = ref<SearchResult[]>([])

  let menuList: Menu[] = []

  onBeforeMount(() => {
    const list = createMenus(getCurMenus());
    menuList = cloneDeep(list)

    console.log(menuList);
  })

  /**
   * 检索方法回调
   * @param evnet
   */
  function search(evnet: ChangeEvent) {
    evnet.stopPropagation()
    const key = evnet.target?.["_value"] || ""
    keyword.value = key
    if (!key) {
      searchResult.value = []
      return
    }
    const reg = createSearchReg(unref(keyword))

    const filterMenu = filter(menuList, (item) => {
      return reg.test(item.name) && !item.hideMenu
    })

    searchResult.value = handlerSearchResult(filterMenu, reg)
    activeIndex.value = 0
  }

  /**
   * 检索匹配结果
   * @param filterMenu
   * @param reg
   * @param parent
   */
  function handlerSearchResult(filterMenu: Menu[], reg: RegExp, parent?: Menu): SearchResult[] {
    const ret: SearchResult[] = []
    filterMenu.forEach((item: Menu) => {
      const { name, path, icon, children, hideMenu, meta } = item
      if (!hideMenu && reg.test(name) && (!children?.length || meta?.hideChildrenInMenu)) {
        ret.push({
          name: parent?.name ? `${parent.name} > ${name}` : name,
          path,
          icon,
        })
      }

      // 处理子菜单，将其拍平
      if (!meta?.hideChildrenInMenu && children?.length) {
        ret.push(...handlerSearchResult(children, reg, item))
      }
    })
    return ret
  }

  /**
   * 鼠标移入搜索结果
   * @param event
   */
  function handleMouseenter(event: MouseEvent) {
    const index = Number((event.target as HTMLElement).dataset.index)
    activeIndex.value = index
  }

  /**
   * 选中搜索结果，进行跳转
   * @returns
   */
  function handleEnter() {
    if (!unref(searchResult).length) return
    if (unref(activeIndex) < 0) return


    const result = unref(searchResult)
    const index = unref(activeIndex)

    const to = result[index]
    handleClose()

    console.log(to);

    nextTick(() => {
      // go(to.path)
    })
  }

  /**
   * 键盘向上事件
   * @returns
   */
  function handleUp() {
    console.log(1111)
    if (!unref(searchResult).length) return
    activeIndex.value--
    if (unref(activeIndex) < 0) {
      // 这里必须处理默认情况，否则将会出现无法选中最后一个的情况
      activeIndex.value = unref(searchResult).length - 1
    }

    handleScroll()
  }

  /**
   * 键盘向下事件
   * @returns
   */
  function handleDown() {
    if (!unref(searchResult).length) return
    activeIndex.value++
    // 这里必须处理默认情况，否则将会影响到 Enter 事件
    if (unref(activeIndex) > unref(searchResult).length - 1) {
      activeIndex.value = 0
    }
    handleScroll()
  }

  /**
   * 关闭搜索
   * @returns
   */
  function handleClose() {
    activeIndex.value = -1
    keyword.value = ""
    searchResult.value = []
    emits("close", false)
  }

  /**
   * 区域滚动
   * @returns
   * @description 为了防止键盘【ArrowUp/ArrowDown】事件时，已经选中的数据，超过了可视区范围，滚动条必须自动滚动到可视区域
   */
  function handleScroll() {
    const index = unref(activeIndex)
    const el = document.querySelector(`.search-modal-result-item[data-index="${index}"]`) as HTMLElement
    if (!el) return

    const wrapEl = unref(scrollWrap)
    if (!wrapEl) return

    const currentRef = el.offsetTop + el.offsetHeight // 当前元素距离顶部的距离 + 当前元素的高度
    const wrapHeight = wrapEl.offsetHeight // 容器的高度

    if (currentRef > wrapHeight) {
      const { x, y } = useScroll(scrollWrap, { behavior: "smooth" })
      x.value = 0
      y.value = currentRef - wrapHeight
    }
  }

  return { keyword, searchResult, activeIndex, handleSearch, handleMouseenter, handleEnter, handleClose, handleUp, handleDown }
}
