/**
 * @file 项目基础配置文件
 * @module config/project
 * @description 项目基础配置文件，包含项目的基本配置信息
 */

import { ThemeEnum } from "../enums/appEnum"
import { CacheLocationEnum } from "../enums/cacheEnum"
import { type ProjectConfig } from "/#/config"

/** 设置统一项目前缀 */
export const PREFIX_CLS = "voir"

/** 项目主题色 */
export const PRIMARY_COLOR = "#0960bd"

/** 项目默认主题 */
export const DEFAULT_THEME_MODE = ThemeEnum.LIGHT

/** 项目默认缓存时间 */
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

/** 项目默认缓存位置 */
export const CACHE_LOCATION = CacheLocationEnum.LOCAL

/** 项目默认配置 */
export const PROJ_CFG: ProjectConfig = {
  theme: ThemeEnum.LIGHT,
  themeColor: PRIMARY_COLOR,
  // @ts-ignore
  headerSetting: {},
  // @ts-ignore
  menuSetting: {},
  // @ts-ignore
  transitionSetting: {},
  // @ts-ignore
  multiTabsSetting: {},
}
