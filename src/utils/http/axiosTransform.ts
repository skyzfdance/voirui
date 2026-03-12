/**
 * @file axiosTransform.ts
 * @module utils/http/axiosTransform
 * @description Axios 转换钩子实现
 */

import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios"
import axios from "axios"
import { message, Modal, notification } from "ant-design-vue"
import { AxiosTransform, type RequestOptions, type HttpResponse, type CreateAxiosOptions, ErrorMessageMode } from "./types"
import { getCache, setCache } from "../cache"
import { CacheTypeEnum } from "/@/enums/cacheEnum"

/** 是否正在刷新 token */
let isRefreshing = false
/** 刷新 token 的等待队列 */
let refreshSubscribers: Array<(token: string) => void> = []

/**
 * 订阅 token 刷新
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

/**
 * 通知所有订阅者新 token
 */
function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

/**
 * 刷新 token
 */
async function refreshTokenIfNeeded(): Promise<string | null> {
  // 如果已经在刷新中，等待刷新完成
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token))
    })
  }

  const refreshToken = getCache(CacheTypeEnum.REFRESH_TOKEN_KEY, null) as string | null
  if (!refreshToken) {
    return null
  }

  isRefreshing = true

  try {
    // 直接调用 axios，避免使用封装的 http（防止循环拦截）
    const res = await axios.post("/api/auth/refresh", { refreshToken })

    if (res.data?.success) {
      const { accessToken, refreshToken: newRefreshToken, expires } = res.data.data

      // 更新缓存
      setCache(CacheTypeEnum.TOKEN_KEY, accessToken)
      setCache(CacheTypeEnum.REFRESH_TOKEN_KEY, newRefreshToken)
      setCache(CacheTypeEnum.TOKEN_EXPIRES_KEY, expires)

      // 通知等待的订阅者
      onTokenRefreshed(accessToken)

      return accessToken
    }
    throw new Error("刷新 token 失败")
  } catch (error) {
    // 刷新失败，清除所有 token
    setCache(CacheTypeEnum.TOKEN_KEY, null)
    setCache(CacheTypeEnum.REFRESH_TOKEN_KEY, null)
    setCache(CacheTypeEnum.TOKEN_EXPIRES_KEY, 0)

    // 跳转到登录页
    window.location.href = "/login"
    throw error
  } finally {
    isRefreshing = false
  }
}

/**
 * 创建默认转换钩子
 * @param opt 创建选项
 */
export function createDefaultTransform(opt: CreateAxiosOptions): AxiosTransform {
  return {
    /**
     * 请求前处理钩子
     * 处理：参数序列化、添加时间戳、URL 拼接等
     */
    beforeRequestHook: (config: AxiosRequestConfig, options: RequestOptions): AxiosRequestConfig => {
      const { joinPrefix, urlPrefix, apiUrl, joinTime = true, formatDate, joinParamsToUrl } = options

      // 处理前缀
      if (joinPrefix && urlPrefix) {
        config.url = `${urlPrefix}${config.url}`
      }

      // 处理基础 URL
      if (apiUrl) {
        config.baseURL = apiUrl
      }

      // 添加时间戳防止缓存
      if (joinTime && config.method?.toUpperCase() === "GET") {
        config.params = {
          ...config.params,
          _t: Date.now(),
        }
      }

      // 格式化日期
      if (formatDate && config.data) {
        config.data = formatRequestDate(config.data)
      }

      // 将参数拼接到 URL（用于某些特殊场景）
      if (joinParamsToUrl && config.data && config.method?.toUpperCase() === "POST") {
        config.url = setObjToUrlParams(config.url!, config.data)
      }

      return config
    },

    /**
     * 响应数据处理钩子
     * 处理：提取数据、错误提示等
     */
    transformResponseHook: (res: AxiosResponse, options: RequestOptions): any => {
      const { isReturnNativeResponse, isTransformResponse = true, errorMessageMode = ErrorMessageMode.MESSAGE } = options

      // 返回原生响应
      if (isReturnNativeResponse) {
        return res
      }

      // 不转换响应，直接返回 data
      if (!isTransformResponse) {
        return res.data
      }

      const responseData = res.data as HttpResponse

      // 处理业务错误
      if (!responseData.success) {
        handleErrorMessage(responseData.message || "请求失败", errorMessageMode)
        throw new Error(responseData.message || "请求失败")
      }

      return responseData.data
    },

    /**
     * 请求失败处理钩子
     */
    requestCatchHook: async (error: AxiosError, options: RequestOptions): Promise<any> => {
      const { errorMessageMode = ErrorMessageMode.MESSAGE, retryRequest } = options

      // 处理重试逻辑
      if (retryRequest?.isOpenRetry) {
        const { count, waitTime } = retryRequest
        // 重试逻辑在 Axios 类中处理
        throw error
      }

      // 处理错误消息
      let errorMessage = "网络错误"
      if (error.response) {
        errorMessage = handleHttpError(error.response.status)
      } else if (error.request) {
        errorMessage = "网络连接失败"
      }

      handleErrorMessage(errorMessage, errorMessageMode)
      throw error
    },

    /**
     * 请求拦截器
     */
    requestInterceptors: (config: InternalAxiosRequestConfig, options: CreateAxiosOptions): InternalAxiosRequestConfig => {
      const { requestOptions, authenticationScheme = "Bearer" } = options
      const { withToken = true } = requestOptions || {}

      // 添加 token
      if (withToken) {
        const token = getCache(CacheTypeEnum.TOKEN_KEY, null)
        if (token && config.headers) {
          config.headers.Authorization = authenticationScheme ? `${authenticationScheme} ${token}` : token
        }

        // 检查 token 是否即将过期（提前 5 分钟刷新）
        const expires = (getCache(CacheTypeEnum.TOKEN_EXPIRES_KEY) as number) || 0
        if (expires && expires - Date.now() < 5 * 60 * 1000) {
          // Token 即将过期，触发刷新（异步，不阻塞当前请求）
          refreshTokenIfNeeded().catch(() => {
            // 刷新失败不处理，让后续请求返回 401 后统一处理
          })
        }
      }

      // 开发环境打印请求日志
      if (import.meta.env.DEV) {
        console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)
      }

      return config
    },

    /**
     * 响应拦截器
     */
    responseInterceptors: (res: AxiosResponse): AxiosResponse => {
      // 开发环境打印响应日志
      if (import.meta.env.DEV) {
        console.log(`[HTTP Response] ${res.config.method?.toUpperCase()} ${res.config.url}`, res.data)
      }
      return res
    },

    /**
     * 请求拦截器错误处理
     */
    requestInterceptorsCatch: (error: AxiosError): void => {
      console.error("[HTTP Request Error]", error)
    },

    /**
     * 响应拦截器错误处理
     */
    responseInterceptorsCatch: (error: AxiosError): void => {
      console.error("[HTTP Response Error]", error)
    },
  }
}

/**
 * 处理 HTTP 错误状态码
 * @param status HTTP 状态码
 */
function handleHttpError(status: number): string {
  switch (status) {
    case 401:
      return "未授权，请重新登录"
    case 403:
      return "拒绝访问"
    case 404:
      return "请求地址不存在"
    case 408:
      return "请求超时"
    case 500:
      return "服务器内部错误"
    case 501:
      return "服务未实现"
    case 502:
      return "网关错误"
    case 503:
      return "服务不可用"
    case 504:
      return "网关超时"
    default:
      return `请求错误: ${status}`
  }
}

/**
 * 处理错误消息提示
 * @param msg 错误消息
 * @param mode 提示方式
 */
function handleErrorMessage(msg: string, mode: ErrorMessageMode): void {
  switch (mode) {
    case ErrorMessageMode.MESSAGE:
      message.error(msg)
      break
    case ErrorMessageMode.MODAL:
      Modal.error({ title: "错误", content: msg })
      break
    case ErrorMessageMode.NOTIFICATION:
      notification.error({ message: "错误", description: msg })
      break
    case ErrorMessageMode.NONE:
    default:
      break
  }
}

/**
 * 格式化请求日期
 * @param data 请求数据
 */
function formatRequestDate(data: Record<string, any>): Record<string, any> {
  const formatted: Record<string, any> = {}
  for (const key in data) {
    if (data[key] instanceof Date) {
      formatted[key] = data[key].toISOString()
    } else if (typeof data[key] === "object" && data[key] !== null) {
      formatted[key] = formatRequestDate(data[key])
    } else {
      formatted[key] = data[key]
    }
  }
  return formatted
}

/**
 * 将对象转换为 URL 参数
 * @param baseUrl 基础 URL
 * @param obj 参数对象
 */
function setObjToUrlParams(baseUrl: string, obj: Record<string, any>): string {
  const params = new URLSearchParams()
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      params.append(key, String(obj[key]))
    }
  }
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
