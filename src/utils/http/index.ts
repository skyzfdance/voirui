/**
 * @file index.ts
 * @module utils/http
 * @description HTTP 请求模块入口
 */

import { VAxios } from "./Axios"
import { createDefaultTransform } from "./axiosTransform"
import type { CreateAxiosOptions, HttpInstance } from "./types"
import { ContentTypeEnum, ErrorMessageMode } from "./types"

/** 全局配置 */
const globSetting = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "",
  urlPrefix: import.meta.env.VITE_API_URL_PREFIX || "",
}

/** 创建 Axios 配置 */
function createAxiosConfig(): CreateAxiosOptions {
  return {
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
    authenticationScheme: "Bearer",
    timeout: 10 * 1000,
    // 基础接口地址
    baseURL: globSetting.apiUrl,

    headers: { "Content-Type": ContentTypeEnum.JSON },
    // 如果是 form-data 格式
    // headers: { "Content-Type": ContentTypeEnum.FORM_URLENCODED },

    // 数据处理方式
    transform: createDefaultTransform({} as CreateAxiosOptions),

    // 配置项，下面的选项都可以在独立的接口请求中覆盖
    requestOptions: {
      // 默认将 prefix 添加到 url
      joinPrefix: true,
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      isReturnNativeResponse: false,
      // 需要对返回数据进行处理
      isTransformResponse: true,
      // post 请求的时候添加参数到 url
      joinParamsToUrl: false,
      // 格式化提交参数时间
      formatDate: true,
      // 消息提示类型
      errorMessageMode: ErrorMessageMode.MESSAGE,
      // 接口地址
      apiUrl: globSetting.apiUrl,
      // 接口拼接地址
      urlPrefix: globSetting.urlPrefix,
      // 是否加入时间戳
      joinTime: true,
      // 忽略重复请求
      ignoreCancelToken: true,
      // 是否携带 token
      withToken: true,
      // 重试机制
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 100,
      },
    },
  }
}

/** 创建 HTTP 实例 */
function createHttp(): HttpInstance {
  const config = createAxiosConfig()
  const axiosInstance = new VAxios(config)

  return {
    axiosInstance: axiosInstance.getAxios(),
    get: axiosInstance.get.bind(axiosInstance),
    post: axiosInstance.post.bind(axiosInstance),
    put: axiosInstance.put.bind(axiosInstance),
    delete: axiosInstance.delete.bind(axiosInstance),
    patch: axiosInstance.patch.bind(axiosInstance),
    request: axiosInstance.request.bind(axiosInstance),
    upload: axiosInstance.upload.bind(axiosInstance),
    requestSSE: axiosInstance.requestSSE.bind(axiosInstance),
    cancelAll: axiosInstance.cancelAll.bind(axiosInstance),
  }
}

/** HTTP 请求对象 */
export const http = createHttp()

/** 创建自定义 HTTP 实例 */
export function createCustomHttp(config: Partial<CreateAxiosOptions>): HttpInstance {
  const defaultConfig = createAxiosConfig()
  const mergedConfig = { ...defaultConfig, ...config }
  const axiosInstance = new VAxios(mergedConfig)

  return {
    axiosInstance: axiosInstance.getAxios(),
    get: axiosInstance.get.bind(axiosInstance),
    post: axiosInstance.post.bind(axiosInstance),
    put: axiosInstance.put.bind(axiosInstance),
    delete: axiosInstance.delete.bind(axiosInstance),
    patch: axiosInstance.patch.bind(axiosInstance),
    request: axiosInstance.request.bind(axiosInstance),
    upload: axiosInstance.upload.bind(axiosInstance),
    requestSSE: axiosInstance.requestSSE.bind(axiosInstance),
    cancelAll: axiosInstance.cancelAll.bind(axiosInstance),
  }
}

export default http

// 导出类型
export type {
  CreateAxiosOptions,
  RequestConfig,
  RequestOptions,
  HttpResponse,
  HttpInstance,
  SSECallbacks,
  SSERequestConfig,
  SSEController,
  RetryRequest,
} from "./types"

export { ContentTypeEnum, RequestMethodEnum, ErrorMessageMode } from "./types"
export { VAxios } from "./Axios"
export { createDefaultTransform } from "./axiosTransform"
