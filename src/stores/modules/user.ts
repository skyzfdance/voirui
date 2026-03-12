/**
 * @file 用户信息模块
 * @module store/user
 * @description 用户信息模块，存储用户信息、用户权限、用户设置等
 */

import { defineStore } from "pinia"
import { store } from ".."
import { setCache, getCache, removeCache, clearCache } from "/@/utils/cache"
import { CacheTypeEnum } from "/@/enums/cacheEnum"
import { Modal, message } from "ant-design-vue"
import { http } from "/@/utils/http"

/** 用户信息接口 */
export interface UserInfo {
  /** 用户名 */
  name?: string
  /** 头像 */
  avatar?: string
  /** 角色 */
  role?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 其他自定义字段 */
  [key: string]: any
}

/** Token 信息接口 */
interface TokenInfo {
  accessToken: string
  refreshToken: string
  expires: number
}

/** 用户状态接口 */
interface UserState {
  /** Token */
  token: string | null
  /** Refresh Token */
  refreshToken: string | null
  /** Token 过期时间 */
  tokenExpires: number
  /** 用户信息 */
  userInfo: UserInfo | null
  /** 权限码列表 */
  userAuths: string[]
}

export const useUserStore = defineStore("app-user", {
  state: (): UserState => ({
    token: null, // Token
    refreshToken: null, // Refresh Token
    tokenExpires: 0, // Token 过期时间
    userInfo: null as UserInfo | null, // 用户信息
    userAuths: [], // 权限码列表
  }),
  getters: {
    /**
     * 获取 Token
     */
    getToken(): string | null {
      return this.token || getCache(CacheTypeEnum.TOKEN_KEY)
    },
    /**
     * 获取用户信息
     */
    getUserInfo(): UserInfo | null {
      return this.userInfo || getCache(CacheTypeEnum.USER_INFO_KEY)
    },
    /**
     * 获取权限码列表
     */
    getUserAuths(): string[] {
      return this.userAuths || getCache(CacheTypeEnum.ROLES_KEY)
    },
  },
  actions: {
    /**
     * 设置 Token 信息
     * @param tokenInfo - Token 信息对象
     */
    setTokenInfo(tokenInfo: TokenInfo | null) {
      if (tokenInfo) {
        this.token = tokenInfo.accessToken
        this.refreshToken = tokenInfo.refreshToken
        this.tokenExpires = tokenInfo.expires
        setCache(CacheTypeEnum.TOKEN_KEY, tokenInfo.accessToken)
        setCache(CacheTypeEnum.REFRESH_TOKEN_KEY, tokenInfo.refreshToken)
        setCache(CacheTypeEnum.TOKEN_EXPIRES_KEY, tokenInfo.expires)
      } else {
        this.token = null
        this.refreshToken = null
        this.tokenExpires = 0
        removeCache(CacheTypeEnum.TOKEN_KEY)
        removeCache(CacheTypeEnum.REFRESH_TOKEN_KEY)
        removeCache(CacheTypeEnum.TOKEN_EXPIRES_KEY)
      }
    },

    /**
     * 设置用户信息
     * @param userInfo - 用户信息对象
     */
    setUserInfo(userInfo: UserInfo | null) {
      this.userInfo = userInfo
      if(userInfo){
        setCache(CacheTypeEnum.USER_INFO_KEY, userInfo)
      } else {
        removeCache(CacheTypeEnum.USER_INFO_KEY)
      }
    },

    /**
     * 设置权限码列表
     * @param auths - 权限码数组
     */
    setUserAuths(auths: string[]) {
      this.userAuths = auths
      setCache(CacheTypeEnum.ROLES_KEY, auths)
    },
    /**
     * 用户登录
     * @param account 账号
     * @param password 密码
     */
    async login(account: string, password: string) {
      const res = await http.post("/api/auth/login", { account, password })

      // 保存 token 信息
      this.setTokenInfo({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expires: res.expires,
      })

      // 获取用户信息
      await this.fetchUserInfo()

      message.success("登录成功")
      return res
    },

    /**
     * 从服务器获取用户信息
     * @description 调用后端接口获取用户信息和权限码
     */
    async fetchUserInfo() {
      try {
        const res = await http.get("/api/user/info")

        // 保存用户信息
        this.setUserInfo(res)
        // 保存权限码
        this.setUserAuths(res.permissions || [])

        return res
      } catch (error) {
        console.error("获取用户信息失败:", error)
        throw error
      }
    },

    /**
     * 重置状态（退出登录时使用）
     */
    resetState() {
      this.setTokenInfo(null)
      this.userInfo = null as UserInfo | null
      this.userAuths = []
      // 清理本地缓存
      removeCache(CacheTypeEnum.USER_INFO_KEY)
      removeCache(CacheTypeEnum.ROLES_KEY)
    },

    /**
     * 退出登录前置
     * @param isModal - 是否需要弹窗确认，默认 true
     */
    async logoutBefore(isModal = true) {
      if (isModal) {
        Modal.confirm({
          title: "提示",
          content: "确定要退出登录吗？",
          onOk: () => {
            this.logout()
          },
        })
        return Promise.resolve(true)
      }
      this.logout().then(() => {
        return Promise.resolve(true)
      })
    },

    /**
     * 退出登录
     * @param redirect - 是否需要跳转，默认 true
     * @description 统一退出登录入口，清理所有缓存数据
     */
    async logout(redirect = true) {
      // 清理用户状态
      this.resetState()
      
      // 清理所有缓存（包括主题、配置等）
      clearCache()
      
      // 导入 router（避免循环依赖）
      const { router } = await import("/@/router")
      
      // 重置路由
      const { resetRouter } = await import("/@/router")
      resetRouter()
      
      // 跳转到登录页
      if (redirect) {
        router.replace({
          path: "/login",
          query: redirect ? { redirect: window.location.href } : undefined,
        })
      }
    },
  },
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}
