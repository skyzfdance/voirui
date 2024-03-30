/**
 * @file cache.ts
 * @module utils/cache
 * @description 本地缓存工具
 */

import { CacheTypeEnum, CacheLocationEnum } from "/@/enums/cacheEnum"
import pack from "../../package.json"
import { CACHE_LOCATION } from "/@/config/project"
import { isNull } from "lodash-es"
import { PREFIX_CLS } from "../config/project"

export interface CacheType {
  version: string
  data: Record<string, any>
  createTime: number
}

/** 生成缓存键 */
function generateCaheKey(): string {
  // 项目前缀
  const VITE_APP_TITLE = PREFIX_CLS.toUpperCase()
  // 系统版本号
  const version = pack.version

  return `${VITE_APP_TITLE}_${version}_CACHE`
}

/**
 * 生成缓存
 * @param {Storage} storage - 缓存存储对象
 */
function generateCahe(storage: Storage = localStorage) {
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
 * 设置缓存
 * @param key 需要设置的缓存key
 * @param value 需要设置的缓存value
 */
export function setCache(key: CacheTypeEnum, value: any) {
  _setCache(key, value, CACHE_LOCATION === CacheLocationEnum.LOCAL ? localStorage : sessionStorage)
}

/**
 * 获取缓存
 * @param key 需要获取的缓存key
 * @param def 如果没有获取到缓存，返回的默认值
 */
export function getCache(key: CacheTypeEnum, def = null) {
  return _getCache(key, def, CACHE_LOCATION === CacheLocationEnum.LOCAL ? localStorage : sessionStorage)
}

/**
 * 移除缓存
 * @param key 需要移除的缓存key
 */
export function removeCache(key: CacheTypeEnum) {
  _removeCache(key, CACHE_LOCATION === CacheLocationEnum.LOCAL ? localStorage : sessionStorage)
}

/** 重置缓存 */
export function clearCache() {
  _clearCache(CACHE_LOCATION === CacheLocationEnum.LOCAL ? localStorage : sessionStorage)
}

/** 刷新缓存 */
export function resetCache() {
  _resetCache(CACHE_LOCATION === CacheLocationEnum.LOCAL ? localStorage : sessionStorage)
}

/** ===== 以下为实际操作方法，localStorage 和 sessionStorage 为特殊变量，无法复制给变量，只能通过复写方法实现 ===== */

function _setCache(key: CacheTypeEnum, value: any, storage: Storage) {
  let cache = storage.getItem(generateCaheKey())
  if (isNull(cache)) {
    generateCahe(storage)
    // 重新获取缓存
    cache = storage.getItem(generateCaheKey())
  }

  const parseCache: CacheType = JSON.parse(cache!)
  Reflect.set(parseCache.data, key, value)
  storage.setItem(generateCaheKey(), JSON.stringify(parseCache))
}

function _getCache(key: CacheTypeEnum, def = null, storage: Storage) {
  const cache = storage.getItem(generateCaheKey())
  if (isNull(cache)) return def

  const parseCache: CacheType = JSON.parse(cache)
  return Reflect.get(parseCache.data, key) || def
}

function _removeCache(key: CacheTypeEnum, storage: Storage) {
  const cache = storage.getItem(generateCaheKey())
  if (!cache) return

  const parseCache: CacheType = JSON.parse(cache)
  Reflect.deleteProperty(parseCache.data, key)

  storage.setItem(generateCaheKey(), JSON.stringify(parseCache))
}

function _clearCache(storage: Storage) {
  storage.setItem(
    generateCaheKey(),
    JSON.stringify({
      version: pack.version,
      data: {},
      createTime: Date.now(),
    }),
  )
}

function _resetCache(storage: Storage) {
  const cache = storage.getItem(generateCaheKey())
  if (!cache) return

  // 重置缓存生成时间
  const parseCache: CacheType = JSON.parse(cache)
  parseCache.createTime = Date.now()

  // 写入缓存
  storage.setItem(generateCaheKey(), JSON.stringify(parseCache))
}
