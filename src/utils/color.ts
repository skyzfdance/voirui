/**
 * @file 颜色工具函数
 * @module utils/color
 */

import { PREFIX_CLS } from "/@/config/project";


function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16).toLocaleUpperCase() : `0${c.toString(16)}`
}

/**
 * 
 * @param color
 * @param amount 
 * @returns 
 */
export function lighten(color: string, amount: number): string {
  color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : PREFIX_CLS
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(color.substring(2, 4), amount)}${addLight(color.substring(4, 6), amount)}`
}
