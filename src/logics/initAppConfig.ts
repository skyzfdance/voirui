/**
 * @file initAppConfig.ts
 * @module logics/initAppConfig
 * @description 初始化项目配置
 */
import type { ProjectConfig } from "/#/config"
import { useAppStore } from "/@/stores/modules/app"
import { merge } from "lodash-es"
import { PROJ_CFG, DEFAULT_CACHE_TIME } from "/@/config/project"
import { type CacheType, getCache } from "../utils/cache"
import { CacheTypeEnum } from "/@/enums/cacheEnum"
import pack from "../../package.json"

/** 初始化项目 */
export function initAppConfigStore(): void {
  const appStore = useAppStore()

  const projCfg: ProjectConfig = merge<ProjectConfig, Partial<ProjectConfig>>(PROJ_CFG, getCache(CacheTypeEnum.PROJ_CFG_KEY) || {})

  appStore.setProjectConfig(projCfg)

    // TODO 未完成

  setTimeout(() => {
    clearObsoleteStorage()
  }, 16)
}

/** 清理过期缓存 */
export function clearObsoleteStorage() {
  const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE
  const version = pack.version

  ;[localStorage, sessionStorage].forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key.startsWith(VITE_APP_TITLE)) {
        const keys = key.split("_")
        // 如果版本号不对应，直接删除缓存，一定是过期的
        if (keys.length >= 1 && keys[1] !== version) {
          item.removeItem(key)
        } else {
          // 如果时间已过期，删除缓存
          const data: CacheType = JSON.parse(item.getItem(key)!)
          const time = data.createTime
          const expiration = Date.now() + DEFAULT_CACHE_TIME
          if (expiration < time) {
            item.removeItem(key)
          }
        }
      }
    })
  })
}
