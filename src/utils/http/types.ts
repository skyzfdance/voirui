/**
 * @file types.ts
 * @module utils/http/types
 * @description HTTP 请求类型定义
 */

import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
  AxiosError,
} from "axios"

/** Content-Type 枚举 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data  upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}

/** 请求方式枚举 */
export enum RequestMethodEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

/** 错误提示方式 */
export enum ErrorMessageMode {
  NONE = "none",
  MESSAGE = "message",
  MODAL = "modal",
  NOTIFICATION = "notification",
}

/** 重试配置 */
export interface RetryRequest {
  /** 是否开启重试 */
  isOpenRetry: boolean
  /** 重试次数 */
  count: number
  /** 等待时间(ms) */
  waitTime: number
}

/** 请求选项 */
export interface RequestOptions {
  /** 是否将 prefix 添加到 url */
  joinPrefix?: boolean
  /** 是否返回原生响应头 */
  isReturnNativeResponse?: boolean
  /** 是否需要对返回数据进行处理 */
  isTransformResponse?: boolean
  /** post 请求时添加参数到 url */
  joinParamsToUrl?: boolean
  /** 格式化提交参数时间 */
  formatDate?: boolean
  /** 消息提示类型 */
  errorMessageMode?: ErrorMessageMode
  /** 接口地址 */
  apiUrl?: string
  /** 接口拼接地址 */
  urlPrefix?: string
  /** 是否加入时间戳 */
  joinTime?: boolean
  /** 忽略重复请求（取消token） */
  ignoreCancelToken?: boolean
  /** 是否携带 token */
  withToken?: boolean
  /** 重试机制配置 */
  retryRequest?: RetryRequest
  /** 是否显示加载中 */
  showLoading?: boolean
  /** 认证方案 */
  authenticationScheme?: string
}

/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 请求选项 */
  requestOptions?: RequestOptions
}

/** 创建 Axios 选项 */
export interface CreateAxiosOptions extends AxiosRequestConfig {
  /** 认证方案 */
  authenticationScheme?: string
  /** 请求选项 */
  requestOptions?: RequestOptions
  /** 转换钩子 */
  transform?: AxiosTransform
}

/** HTTP 响应数据标准格式 */
export interface HttpResponse<T = any> {
  /** 业务状态码 */
  code: number
  /** 响应数据 */
  data: T
  /** 响应消息 */
  message: string
  /** 是否成功 */
  success: boolean
}

/** Axios 转换钩子 */
export abstract class AxiosTransform {
  /**
   * 请求前钩子
   * @param config Axios 配置
   * @param options 请求选项
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

  /**
   * 转换响应数据钩子
   * @param res 响应对象
   * @param options 请求选项
   */
  transformResponseHook?: (res: AxiosResponse, options: RequestOptions) => any

  /**
   * 请求失败钩子
   * @param e 错误对象
   * @param options 请求选项
   */
  requestCatchHook?: (e: AxiosError, options: RequestOptions) => Promise<any>

  /**
   * 请求拦截器
   * @param config Axios 配置
   * @param options 创建选项
   */
  requestInterceptors?: (
    config: InternalAxiosRequestConfig,
    options: CreateAxiosOptions
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

  /**
   * 响应拦截器
   * @param res 响应对象
   */
  responseInterceptors?: (res: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>

  /**
   * 请求拦截器错误处理
   * @param error 错误对象
   */
  requestInterceptorsCatch?: (error: AxiosError) => void

  /**
   * 响应拦截器错误处理
   * @param error 错误对象
   */
  responseInterceptorsCatch?: (error: AxiosError) => void
}

/** SSE 消息回调 */
export interface SSECallbacks<T = any> {
  /** 收到消息回调 */
  onMessage?: (data: T) => void
  /** 发生错误回调 */
  onError?: (error: Error) => void
  /** 连接完成回调 */
  onComplete?: () => void
  /** 连接打开回调 */
  onOpen?: () => void
}

/** SSE 请求配置 */
export interface SSERequestConfig {
  /** 请求 URL */
  url: string
  /** 请求方法 */
  method?: "GET" | "POST"
  /** 请求参数 */
  params?: Record<string, any>
  /** 请求体数据 */
  data?: Record<string, any>
  /** 请求头 */
  headers?: Record<string, string>
  /** 是否需要 token */
  withToken?: boolean
}

/** SSE 控制器 */
export interface SSEController {
  /** 中止连接 */
  abort: () => void
  /** 是否已中止 */
  aborted: boolean
}

/** 待处理的请求 */
export interface PendingRequest {
  /** 请求标识 */
  key: string
  /** 取消函数 */
  cancel: () => void
}

/** HTTP 实例方法 */
export interface HttpInstance {
  /** Axios 实例 */
  axiosInstance: AxiosInstance
  /** GET 请求 */
  get: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  /** POST 请求 */
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  /** PUT 请求 */
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  /** DELETE 请求 */
  delete: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  /** PATCH 请求 */
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  /** 通用请求 */
  request: <T = any>(config: RequestConfig) => Promise<T>
  /**
   * 上传文件
   * @param url 上传地址
   * @param file 文件对象或文件列表
   * @param name 文件字段名（默认 'file'）
   * @param data 其他附加数据
   * @param config 请求配置
   */
  upload: <T = any>(
    url: string,
    file: File | File[],
    name?: string,
    data?: Record<string, any>,
    config?: RequestConfig
  ) => Promise<T>
  /** SSE 请求 */
  requestSSE: <T = any>(config: SSERequestConfig, callbacks: SSECallbacks<T>) => SSEController
  /** 取消所有请求 */
  cancelAll: () => void
}
