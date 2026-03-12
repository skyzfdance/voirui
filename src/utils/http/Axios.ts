/**
 * @file Axios.ts
 * @module utils/http/Axios
 * @description Axios 封装类，支持重试、取消、拦截器等功能
 */

import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { cloneDeep } from "lodash-es"
import { getCache } from "../cache"
import { CacheTypeEnum } from "/@/enums/cacheEnum"
import type {
  CreateAxiosOptions,
  RequestConfig,
  RequestOptions,
  PendingRequest,
  SSECallbacks,
  SSERequestConfig,
  SSEController,
  HttpInstance,
} from "./types"
import { ContentTypeEnum } from "./types"

/**
 * Axios 封装类
 */
export class VAxios {
  /** Axios 实例 */
  private axiosInstance: AxiosInstance
  /** 创建选项 */
  private options: CreateAxiosOptions
  /** 待处理的请求集合 */
  private pendingRequests = new Map<string, PendingRequest>()

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  /**
   * 获取 Axios 实例
   */
  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    const { transform } = this.options
    if (!transform) return

    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 处理请求取消
        this.addPendingRequest(config)

        // 调用自定义请求拦截器
        if (requestInterceptors) {
          return requestInterceptors(config, this.options)
        }
        return config
      },
      (error: AxiosError) => {
        if (requestInterceptorsCatch) {
          requestInterceptorsCatch(error)
        }
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 移除待处理请求
        this.removePendingRequest(response.config)

        // 调用自定义响应拦截器
        if (responseInterceptors) {
          return responseInterceptors(response)
        }
        return response
      },
      (error: AxiosError) => {
        // 移除待处理请求
        if (error.config) {
          this.removePendingRequest(error.config)
        }

        // 处理取消请求
        if (axios.isCancel(error) || error.name === "AbortError") {
          return Promise.reject(error)
        }

        // 调用自定义响应错误拦截器
        if (responseInterceptorsCatch) {
          responseInterceptorsCatch(error)
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * 生成请求唯一标识
   */
  private generateRequestKey(config: AxiosRequestConfig): string {
    const { url, method, params, data } = config
    return `${method}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`
  }

  /**
   * 添加待处理请求
   */
  private addPendingRequest(config: InternalAxiosRequestConfig): void {
    const { requestOptions } = this.options
    if (requestOptions?.ignoreCancelToken) return

    const key = this.generateRequestKey(config)
    const controller = new AbortController()
    config.signal = controller.signal
    this.pendingRequests.set(key, {
      key,
      cancel: () => controller.abort(),
    })
  }

  /**
   * 移除待处理请求
   */
  private removePendingRequest(config: AxiosRequestConfig): void {
    const key = this.generateRequestKey(config)
    this.pendingRequests.delete(key)
  }

  /**
   * 取消所有请求
   */
  cancelAll(): void {
    this.pendingRequests.forEach((request) => {
      request.cancel()
    })
    this.pendingRequests.clear()
  }

  /**
   * 支持 form-data 的请求
   */
  supportFormData(config: AxiosRequestConfig): AxiosRequestConfig {
    const headers = config.headers || {}
    const contentType = headers["Content-Type"] || headers["content-type"]

    if (
      contentType !== ContentTypeEnum.FORM_DATA ||
      !config.data ||
      Reflect.has(config.data, "_isFormData")
    ) {
      return config
    }

    // 转换为 FormData
    const formData = new FormData()
    Object.keys(config.data).forEach((key) => {
      const value = config.data[key]
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item))
      } else {
        formData.append(key, value)
      }
    })

    return {
      ...config,
      data: formData,
    }
  }

  /**
   * 执行请求
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    const { transform, requestOptions } = this.options
    const { beforeRequestHook, transformResponseHook, requestCatchHook } = transform || {}

    // 合并请求选项
    const opts: RequestOptions = { ...requestOptions, ...config.requestOptions }

    // 克隆配置，防止修改原配置
    let conf: RequestConfig = cloneDeep(config)
    conf.requestOptions = opts

    // 请求前钩子
    if (beforeRequestHook) {
      conf = beforeRequestHook(conf, opts)
    }

    // 支持 form-data
    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then((res: AxiosResponse) => {
          // 响应数据转换
          if (transformResponseHook) {
            try {
              const ret = transformResponseHook(res, opts)
              resolve(ret)
            } catch (err) {
              reject(err)
            }
          } else {
            resolve(res.data)
          }
        })
        .catch((e: AxiosError) => {
          // 请求失败处理
          if (requestCatchHook) {
            reject(requestCatchHook(e, opts))
          } else {
            reject(e)
          }
        })
    })
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: "GET", url })
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: "POST", url, data })
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: "PUT", url, data })
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: "DELETE", url })
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request({ ...config, method: "PATCH", url, data })
  }

  /**
   * 上传文件
   * @param url 上传地址
   * @param file 文件对象或文件列表
   * @param name 文件字段名（默认 'file'）
   * @param data 其他附加数据
   * @param config 请求配置
   */
  upload<T = any>(
    url: string,
    file: File | File[],
    name: string = "file",
    data?: Record<string, any>,
    config?: RequestConfig
  ): Promise<T> {
    const formData = new FormData()

    // 添加文件
    if (Array.isArray(file)) {
      file.forEach((f) => formData.append(name, f))
    } else {
      formData.append(name, file)
    }

    // 添加其他数据
    if (data) {
      Object.keys(data).forEach((key) => {
        const value = data[key]
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
    }

    return this.request({
      ...config,
      method: "POST",
      url,
      data: formData,
      headers: {
        ...config?.headers,
        "Content-Type": ContentTypeEnum.FORM_DATA,
      },
    })
  }

  /**
   * SSE 请求
   */
  requestSSE<T = any>(config: SSERequestConfig, callbacks: SSECallbacks<T>): SSEController {
    const { url, method = "GET", params, data, headers = {}, withToken = true } = config
    const { onMessage, onError, onComplete, onOpen } = callbacks

    const baseURL = this.options.baseURL || ""
    let fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`

    // 构建查询参数
    if (params) {
      const queryString = new URLSearchParams(params).toString()
      if (queryString) {
        fullUrl += `${fullUrl.includes("?") ? "&" : "?"}${queryString}`
      }
    }

    // 添加时间戳防止缓存
    fullUrl += `${fullUrl.includes("?") ? "&" : "?"}_t=${Date.now()}`

    // 添加 token
    const requestHeaders: Record<string, string> = {
      Accept: "text/event-stream",
      ...headers,
    }

    if (withToken) {
      const { authenticationScheme = "Bearer" } = this.options
      const token = this.getToken()
      if (token) {
        requestHeaders.Authorization = authenticationScheme ? `${authenticationScheme} ${token}` : token
      }
    }

    const controller = new AbortController()
    let aborted = false

    // 使用 fetch + ReadableStream 实现 SSE
    fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: method === "POST" && data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        onOpen?.()

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("Response body is null")
        }

        let buffer = ""

        const readStream = (): Promise<void> => {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              onComplete?.()
              return
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              const trimmedLine = line.trim()
              if (trimmedLine.startsWith("data: ")) {
                const dataStr = trimmedLine.slice(6)
                if (dataStr === "[DONE]") {
                  onComplete?.()
                  return
                }
                try {
                  const parsedData = JSON.parse(dataStr) as T
                  onMessage?.(parsedData)
                } catch {
                  onMessage?.(dataStr as unknown as T)
                }
              }
            }

            return readStream()
          })
        }

        return readStream()
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          onError?.(error)
        }
      })

    return {
      abort: () => {
        if (!aborted) {
          aborted = true
          controller.abort()
        }
      },
      get aborted() {
        return aborted
      },
    }
  }

  /**
   * 获取 Token
   */
  private getToken(): string | null {
    const { requestOptions } = this.options
    if (!requestOptions?.withToken) return null

    // 从缓存获取 token
    return getCache(CacheTypeEnum.TOKEN_KEY, null)
  }
}
