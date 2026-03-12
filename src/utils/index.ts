/**
 * @file index.ts
 * @module utils
 * @description 工具函数统一导出
 */

// HTTP 请求
export { http, createCustomHttp, default as Http } from "./http/index"
export type {
  HttpResponse,
  RequestConfig,
  RequestOptions,
  SSERequestConfig,
  SSECallbacks,
  SSEController,
  HttpInstance,
  CreateAxiosOptions,
  RetryRequest,
} from "./http/index"
export { ContentTypeEnum, RequestMethodEnum, ErrorMessageMode } from "./http/index"
export { VAxios } from "./http/Axios"
export { createDefaultTransform } from "./http/axiosTransform"

// Mock
export { setupMock, createMockResponse, createMockPageResponse } from "./mock"

// 缓存
export {
  setCache,
  getCache,
  removeCache,
  clearCache,
  resetCache,
  type CacheType,
} from "./cache"

// 树形工具
export {
  filter,
  treeMap,
  treeMapEach,
  findPath,
} from "./treeHelper"
