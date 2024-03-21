import type { ProjectConfig, HeaderSetting, MenuSetting, TransitionSetting, MultiTabsSetting } from "/#/config"
import type { BeforeMiniState, SiteInfo } from "/#/store"

import { defineStore } from "pinia"
import { ThemeEnum } from "/@/enums/appEnum"
import { darkMode } from "/@/config/project"
import { APP_DARK_MODE_KEY, PROJ_CFG_KEY } from "/@/enums/cacheEnum"
import { mergeWith } from "lodash-es"

interface AppState {
  darkMode?: ThemeEnum
  pageLoading: boolean
  projectConfig: ProjectConfig | null
  beforeMiniInfo: BeforeMiniState
  siteInfo: SiteInfo | null
}

export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: null,
    beforeMiniInfo: {},
    siteInfo: null,
  }),
  getters: {
    getPageLoading: (state): boolean => state.pageLoading,
    getDarkMode: (state): ThemeEnum | String => state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode,
    getBeforeMiniInfo: (state): BeforeMiniState => state.beforeMiniInfo,
    getProjectConfig: (state): ProjectConfig => state.projectConfig || ({} as ProjectConfig),
    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting
    },
    getSiteInfo(): SiteInfo {
      return this.siteInfo || ({} as SiteInfo)
    },
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
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = mergeWith(this.projectConfig || {}, config)
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig)
    },
  },
})
