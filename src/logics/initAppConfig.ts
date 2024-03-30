/**
 * @file initAppConfig.ts
 * @module logics/initAppConfig
 * @description 初始化项目配置
 */
import type { ProjectConfig } from "/#/config"
import { useAppStore } from "/@/stores/modules/app"
import { merge } from "lodash-es"
import { PROJ_CFG } from "/@/config/project"

/** 初始化项目 */
export function initAppConfigStore(): void {
  // TODO 未完成

  const appStore = useAppStore()

  // XXX 这里有问题，第二个参数是一个函数，应该从缓存中读取
  const projCfg: ProjectConfig = merge<ProjectConfig, Partial<ProjectConfig>>(PROJ_CFG, {})

  appStore.setProjectConfig(projCfg)
}
