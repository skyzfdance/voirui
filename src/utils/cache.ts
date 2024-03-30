/**
 * @file cache.ts
 * @module utils/cache
 * @description 本地缓存工具
 */

import { CacheTypeEnum } from "/@/enums/cacheEnum"
import pack from "../../package.json"
import { CACHE_LOCATION } from "/@/config/project"
import { isNull } from "lodash-es"

export interface CacheType {
  version: string
  data: Record<string, any>
  createTime: number
}

/** 生成缓存键 */
function generateCaheKey(): string {
  // .env  VITE_APP_TITLE
  const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE
  // 系统版本号
  const version = pack.version

  return `${VITE_APP_TITLE}_${version}_CACHE`
}

/**
 * 生成缓存
 * @param {Storage} storage - 缓存存储对象
 */
export function generateCahe(storage: Storage = CACHE_LOCATION) {
  const cache = storage.getItem(generateCaheKey())
  if (!cache) {
    storage.setItem(
      generateCaheKey(),
      JSON.stringify({
        version: pack.version,
        data: {},
        createTime: Date.now(),
      }),
    )
  }
}

/**
 * 写入缓存
 * @param key 需要写入的缓存key
 * @param value 需要写入的缓存value
 */
export function setCache(key: CacheTypeEnum, value: any) {
  let cache = CACHE_LOCATION.getItem(generateCaheKey())
  if (isNull(cache)) {
    generateCahe()
    // 重新获取缓存
    cache = CACHE_LOCATION.getItem(generateCaheKey())
  }

  const parseCache: CacheType = JSON.parse(cache!)
  Reflect.set(parseCache.data, key, value)
  CACHE_LOCATION.setItem(generateCaheKey(), JSON.stringify(parseCache))
}

/**
 * 获取缓存
 * @param key 需要获取的缓存key
 * @param def 如果没有获取到缓存，返回的默认值
 */
export function getCache(key: CacheTypeEnum, def = null) {
  const cache = CACHE_LOCATION.getItem(generateCaheKey())
  if (!cache) return def

  const parseCache: CacheType = JSON.parse(cache)

  return Reflect.get(parseCache.data, key) || def
}

/**
 * 移除缓存
 * @param key 需要移除的缓存key
 */
export function removeCache(key: CacheTypeEnum) {
  const cache = CACHE_LOCATION.getItem(generateCaheKey())
  if (!cache) return

  const parseCache: CacheType = JSON.parse(cache)
  Reflect.deleteProperty(parseCache.data, key)

  CACHE_LOCATION.setItem(generateCaheKey(), JSON.stringify(parseCache))
}

/** 重置缓存 */
export function clearCache() {
  CACHE_LOCATION.setItem(
    generateCaheKey(),
    JSON.stringify({
      version: pack.version,
      data: {},
      createTime: Date.now(),
    }),
  )
}

/** 刷新缓存 */
export function resetCache() {
  const cache = CACHE_LOCATION.getItem(generateCaheKey())
  if (!cache) return

  // 重置缓存生成时间
  const parseCache: CacheType = JSON.parse(cache)
  parseCache.createTime = Date.now()

  // 写入缓存
  CACHE_LOCATION.setItem(generateCaheKey(), JSON.stringify(parseCache))
}
