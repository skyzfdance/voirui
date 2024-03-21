/**
 * @file 全局类名处理
 * @module hooks/useClass
 */
import { PREFIX_CLS } from "/@/config/project"
import { ThemeEnum } from "/@/enums/appEnum"

/**
 * 根据传入的类名构建完整的类名
 * @param cls 类名
 * @returns
 */
export function buildClass(cls: Nullable<string>): string {
  if (!cls) return `${PREFIX_CLS}`
  if (typeof cls !== "string") return `${PREFIX_CLS}`
  cls = cls.trim()
  if (!cls) return `${PREFIX_CLS}`
  if (cls.includes(" ")) {
    return cls
      .split(" ")
      .filter((c) => c)
      .map((c) => `${PREFIX_CLS}-${c}`)
      .join(" ")
  }
  return `${PREFIX_CLS}-${cls}`
}

/**
 * 检查元素是否包含某个类名
 * @param el 需要检查的元素
 * @param className 类名
 * @returns
 * @description 该函数用于检查元素是否包含某个类名，但是className不应该包含空格
 */
export function hasClass(el: Nullable<Element>, className: Nullable<string>): boolean {
  if (!el || !className) return false
  if (className.includes(" ")) throw new Error("className should not contain space.")
  if (el.classList) return el.classList.contains(className)
  // 可能存在多个class，附加空格处理
  return ` ${el.className} `.indexOf(` ${className} `) > -1
}

/**
 * 更新主题
 * @param mode 主题模式
 * @returns
 */
export function updateDarkTheme(mode: string | null = ThemeEnum.LIGHT): void {
  const htmlRoot = document.getElementById("htmlRoot")
  if (!htmlRoot) return

  const hasDarkClass = hasClass(htmlRoot, "dark")
  if (mode === ThemeEnum.DARK) {
    htmlRoot.setAttribute("data-theme", "dark")
    !hasDarkClass && addClass(htmlRoot, "dark")
  } else {
    htmlRoot.setAttribute("data-theme", "light")
    hasDarkClass && removeClass(htmlRoot, "dark")
  }
}

/**
 * 添加类名
 * @param el
 * @param className
 */
export function addClass(el: Nullable<Element>, className: Nullable<string>): void {
  if (!el || !className) return
  let curClass = el.className
  const classes = (className || "").split(" ")

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i]
    if (!cls) continue
    if (el.classList) {
      el.classList.add(cls)
    } else if (!hasClass(el, cls)) {
      curClass += ` ${cls}`
    }
  }

  // 兼容处理，防止浏览器不支持 classList
  !el.classList && (el.className = curClass)
}

/**
 * 移除类名
 * @param el
 * @param className
 * @returns
 */
export function removeClass(el: Nullable<Element>, className: Nullable<string>): void {
  if (!el || !className) return
  let curClass = ` ${el.className} `
  const classes = (className || "").split(" ")

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i]
    if (!cls) continue
    if (el.classList) {
      el.classList.remove(cls)
    } else if (hasClass(el, cls)) {
      curClass = curClass.replace(` ${cls} `, " ")
    }
  }

  // 兼容处理，防止浏览器不支持 classList
  !el.classList && (el.className = curClass.trim())
}
