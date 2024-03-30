import type { ProjectConfig, HeaderSetting, MenuSetting, TransitionSetting, MultiTabsSetting } from "/#/config"
import type { BeforeMiniState, SiteInfo } from "/#/store"

import { defineStore } from "pinia"
import { ThemeEnum } from "/@/enums/appEnum"
import { darkMode } from "/@/config/project"
import { APP_DARK_MODE_KEY, PROJ_CFG_KEY } from "/@/enums/cacheEnum"
import { merge } from "lodash-es"

interface AppState {
  darkMode?: ThemeEnum
  pageLoading: boolean
  projectConfig: Partial<ProjectConfig>
  beforeMiniInfo: BeforeMiniState
  siteInfo: SiteInfo | null
}

export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: {},
    beforeMiniInfo: {},
    siteInfo: null,
  }),
  getters: {
    /** 获取页面 loading 状态 */
    getPageLoading: (state): boolean => state.pageLoading,
    /** 获取当前项目主题(浅色与暗色) */
    getDarkMode: (state): ThemeEnum | String => state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode,

    getBeforeMiniInfo: (state): BeforeMiniState => state.beforeMiniInfo,
    /** 获取当前项目配置 */
    getProjectConfig: (state): Partial<ProjectConfig> => state.projectConfig,
    getHeaderSetting: (state): HeaderSetting => state.projectConfig?.headerSetting || ({} as HeaderSetting),
    getMenuSetting: (state): MenuSetting => state.projectConfig?.menuSetting || ({} as MenuSetting),
    getTransitionSetting: (state): TransitionSetting => state.projectConfig?.transitionSetting || ({} as TransitionSetting),
    getMultiTabsSetting: (state): MultiTabsSetting => state.projectConfig?.multiTabsSetting || ({} as MultiTabsSetting),
    getSiteInfo: (state): SiteInfo => state.siteInfo || ({} as SiteInfo),
  },
  actions: {
    /**
     * 设置当前页面加载状态
     * @param loading
     */
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading
    },
    /**
     * 设置项目主题配置
     * @param mode
     */
    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode
      localStorage.setItem(APP_DARK_MODE_KEY, mode)
    },
    /**
     * 设置切换为迷你状态的当前页面状态
     * @param state
     */
    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state
    },
    /**
     * 设置项目配置
     * @param config
     */
    setProjectConfig(config: Partial<ProjectConfig>): void {
      this.projectConfig = merge<Partial<ProjectConfig>, Partial<ProjectConfig>>(this.projectConfig, config)

      // TODO 写入缓存
      // Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig)
    },
  },
})
