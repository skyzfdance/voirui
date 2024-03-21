import { JSDOM } from "jsdom"
import { expect, test } from "vitest"
import { addClass, buildClass, hasClass, removeClass } from "../useClass"
import { PREFIX_CLS } from "/@/config/project"

test('buildClass', () => {
  // 正常情况，传入一个类名
  expect(buildClass('test')).toBe(`${PREFIX_CLS}-test`)

  // 传入多个类名
  expect(buildClass('test1 test2')).toBe(`${PREFIX_CLS}-test1 ${PREFIX_CLS}-test2`)

  // 传入空字符串，应该返回空字符串
  expect(buildClass('')).toBe(PREFIX_CLS)

  // 传入 null 或 undefined，应该返回空字符串
  expect(buildClass(null)).toBe(PREFIX_CLS)
  expect(buildClass(undefined)).toBe(PREFIX_CLS)


  // 传入包含特殊字符的类名，应该保留特殊字符
  expect(buildClass('test-1 test_2')).toBe(`${PREFIX_CLS}-test-1 ${PREFIX_CLS}-test_2`)
})

test("hasClass", () => {
  const dom = new JSDOM(`<!DOCTYPE html><div id="htmlRoot" class="test"></div>`)
  const element = dom.window.document.querySelector("#htmlRoot")

  // 正常情况，元素有 test 类名
  expect(hasClass(element, "test")).toBe(true)

  // 元素没有 test1 类名
  expect(hasClass(element, "test1")).toBe(false)

  // 类名参数为空字符串
  expect(hasClass(element, "")).toBe(false)

  // 类名参数为 null 或 undefined
  expect(hasClass(element, null)).toBe(false)
  expect(hasClass(element, undefined)).toBe(false)

  // 元素为 null 或 undefined
  expect(hasClass(null, "test")).toBe(false)
  expect(hasClass(undefined, "test")).toBe(false)
})

test("addClass", () => {
  const dom = new JSDOM(`<!DOCTYPE html><div id="htmlRoot"></div>`)
  const element = dom.window.document.querySelector("#htmlRoot")

  if (!element) throw new Error("element not found")

  // 默认情况下，元素没有任何类名
  addClass(element, "test")
  expect(element.className).toBe("test")

  // 添加多个类名
  addClass(element, "test1 test2")
  expect(element.className).toBe("test test1 test2")

  // 添加空类名
  addClass(element, "")
  expect(element.className).toBe("test test1 test2")

  // 添加重复类名
  addClass(element, "test")
  expect(element.className).toBe("test test1 test2")

  // 添加 null 或 undefined 类名
  addClass(element, null)
  addClass(element, undefined)
  expect(element.className).toBe("test test1 test2")

  // 对 null 或 undefined 元素添加类名
  addClass(null, "test3")
  addClass(undefined, "test3")
  expect(element.className).toBe("test test1 test2")
})

test("removeClass", () => {
  const dom = new JSDOM(`<!DOCTYPE html><div id="htmlRoot" class="test test1"></div>`)
  const element = dom.window.document.querySelector("#htmlRoot")

  // 正常情况，移除存在的类名
  removeClass(element, "test")
  expect(hasClass(element, "test")).toBe(false)

  // 移除不存在的类名，应该没有影响
  removeClass(element, "test2")
  expect(hasClass(element, "test1")).toBe(true)

  // 类名参数为空字符串，应该没有影响
  removeClass(element, "")
  expect(hasClass(element, "test1")).toBe(true)

  // 类名参数为 null 或 undefined，应该没有影响
  removeClass(element, null)
  removeClass(element, undefined)
  expect(hasClass(element, "test1")).toBe(true)

  // 元素为 null 或 undefined，应该没有影响
  removeClass(null, "test1")
  removeClass(undefined, "test1")
  expect(hasClass(element, "test1")).toBe(true)
})
