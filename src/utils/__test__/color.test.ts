import { describe, it, expect } from "vitest"
import { isHEX, lighten } from "../color"

describe("isHEX", () => {
  it("#FF0000", () => expect(isHEX("#FF0000")).toBe(true))

  it("FF0000", () => expect(isHEX("FF0000")).toBe(false))

  it("000000", () => expect(isHEX("000000")).toBe(false))

  it("#f00", () => expect(isHEX("#f00")).toBe(true))

  it("hsl", () => expect(isHEX("hsl(0, 100%, 50%)")).toBe(false))
})

describe("lighten", () => {
  it("should lighten the color correctly", () => {
    const color = "#000000"
    const amount = 20
    const result = lighten(color, amount)
    expect(result).toBe("#333333")
  })

  it("should not exceed #FFFFFF when lightening", () => {
    const color = "rgb(255, 255, 255)"
    const amount = 20
    const result = lighten(color, amount)
    expect(result).toBe("#FFFFFF")
  })

  it("should handle color without # correctly", () => {
    const color = "000000"
    const amount = 20
    const result = lighten(color, amount)
    expect(result).toBe("#333333")
  })
})
