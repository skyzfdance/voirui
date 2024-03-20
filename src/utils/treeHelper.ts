/**
 * @file 树形结构工具类
 */

interface TreeHelperConfig {
  id: string
  children: string
  pid: string
}

type ConversionFunction<T> = (node: T) => T

/** 默认树形结构字段映射 */
const DEFAULT_CONFIG = { id: "id", children: "children", pid: "pid" }

const getConfig = (config: Partial<TreeHelperConfig>): TreeHelperConfig => Object.assign({}, DEFAULT_CONFIG, config)

/**
 * 树形结构filter，等用于 Array.prototype.filter
 * @param tree 树形结构数据
 * @param func 过滤方法
 * @param config 字段映射配置
 */
export function filter<T = any>(tree: T[], func: (n: T) => boolean, config: Partial<TreeHelperConfig> = {}): T[] {
  config = getConfig(config)
  const children = config.children!
  function listFilter(list: T[]) {
    return list.filter((node: T) => {
      node[children] = listFilter(node[children] || [])
      return func(node) || node[children].length
    })
  }
  return listFilter(tree)
}

/**
 * 树形结构map，等用于 Array.prototype.map
 * @param tree 树形结构数据
 * @param opt.children 子节点字段名
 * @param opt.childrenKey 重组以后子节点字段名
 * @param opt.conversion 重组方法
 * @returns
 */
export function treeMap<T = any>(tree: T[], opt: { children?: string; childrenKey?: string; conversion: ConversionFunction<T> }): T[] {
  return tree.map((item) => treeMapEach(item, opt))
}

/**
 * treeMap的内部循环方法
 * @param tree 当前节点
 * @param param1 配置项同上
 * @returns
 */
export function treeMapEach<T = any>(
  tree: T,
  { children = "children", childrenKey = "children", conversion }: { children?: string; childrenKey?: string; conversion: ConversionFunction<T> },
): T {
  const haveChildren = Array.isArray(tree[children]) && tree[children].length > 0
  const conversionData = conversion(tree) || {}
  if (!haveChildren) return { ...conversionData } as T
  return {
    ...conversionData,
    [childrenKey]: tree[children].map((i: T) => treeMapEach(i, { children, childrenKey, conversion })),
  } as T
}

/**
 * 树形结构查找，等用于 Array.prototype.find
 * @param tree 
 * @param func 
 * @param config 
 * @returns 
 */
export function findPath<T = any>(tree: T[], func: Function, config: Partial<TreeHelperConfig> = {}): T | T[] | null {
  config = getConfig(config)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = config
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (func(node)) {
        return path
      }
    }
  }
  return null
}
