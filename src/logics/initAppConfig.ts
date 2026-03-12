/**
 * @file initAppConfig.ts
 * @module logics/initAppConfig
 * @description 初始化项目配置
 */
import type { ProjectConfig } from "/#/config"
import { useAppStore } from "/@/stores/modules/app"
import { useUserStore } from "/@/stores/modules/user"
import { merge } from "lodash-es"
import { PROJ_CFG, DEFAULT_CACHE_TIME, PREFIX_CLS } from "/@/config/project"
import { type CacheType, getCache } from "../utils/cache"
import { CacheTypeEnum } from "/@/enums/cacheEnum"
import pack from "../../package.json"

/** 初始化项目 */
export function initAppConfigStore(): void {
  const appStore = useAppStore()

  const projCfg: ProjectConfig = merge<ProjectConfig, Partial<ProjectConfig>>(PROJ_CFG, getCache(CacheTypeEnum.PROJ_CFG_KEY) || {})

  appStore.setProjectConfig(projCfg)

  // 延迟执行其他初始化，避免阻塞应用启动
  setTimeout(() => {
    clearObsoleteStorage()
    initUserInfo()
  }, 16)
}

/**
 * 初始化用户信息
 * @description 如果有有效的 token，自动获取用户信息
 */
async function initUserInfo(): Promise<void> {
  const userStore = useUserStore()

  // 检查是否有 token
  const token = userStore.getToken
  if (!token) {
    return
  }

  // 检查 token 是否过期
  const expires = (getCache(CacheTypeEnum.TOKEN_EXPIRES_KEY) as number) || 0
  if (expires && expires < Date.now()) {
    console.log("[Init] Token 已过期，跳过获取用户信息")
    return
  }

  // 如果已经有用户信息，不需要重复获取
  if (userStore.getUserInfo) {
    return
  }

  try {
    console.log("[Init] 自动获取用户信息...")
    await userStore.fetchUserInfo()
    console.log("[Init] 用户信息获取成功")
  } catch (error) {
    console.error("[Init] 获取用户信息失败:", error)
    // 获取失败不处理，让路由守卫去处理跳转逻辑
  }
}

/** 清理过期缓存 */
export function clearObsoleteStorage() {
  const VITE_APP_TITLE = PREFIX_CLS.toUpperCase()
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
