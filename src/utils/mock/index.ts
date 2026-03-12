/**
 * @file index.ts
 * @module utils/mock
 * @description Mock 数据初始化，仅在开发环境启用
 */

import Mock from "mockjs"

/** 是否启用 Mock */
const isMockEnabled = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== "false"

/** Mock 配置 */
Mock.setup({
  timeout: "300-800", // 模拟网络延迟 300-800ms
})

/**
 * 打印 Mock 请求日志
 */
function logMockRequest(method: string, url: string, body?: any, response?: any) {
  if (!isMockEnabled) return

  const style = {
    method: "color: #1890ff; font-weight: bold;",
    url: "color: #52c41a; font-weight: bold;",
    label: "color: #999;",
    data: "color: #666;",
  }

  console.groupCollapsed(`%c[Mock] %c${method.toUpperCase()} %c${url}`, style.label, style.method, style.url)

  if (body) {
    try {
      const parsedBody = typeof body === "string" ? JSON.parse(body) : body
      console.log("%c请求参数:", style.label, parsedBody)
    } catch {
      console.log("%c请求参数:", style.label, body)
    }
  }

  if (response) {
    console.log("%c响应数据:", style.label, response)
  }

  console.groupEnd()
}

/**
 * 初始化 Mock
 * @description 仅在开发环境自动加载所有 Mock 模块
 */
export function setupMock(): void {
  if (!isMockEnabled) {
    console.log("[Mock] Mock 功能已禁用")
    return
  }

  console.log("[Mock] 初始化 Mock 数据...")

  // 自动导入所有 Mock 模块
  const modules = import.meta.glob("./modules/**/*.ts", { eager: true })

  Object.values(modules).forEach((module: any) => {
    if (module.default && typeof module.default === "function") {
      module.default(Mock)
    }
  })

  console.log("[Mock] Mock 数据初始化完成")
}

export { logMockRequest }

/**
 * 创建标准响应数据
 * @param data 响应数据
 * @param message 响应消息
 * @param code 状态码
 */
export function createMockResponse<T = any>(
  data: T,
  message = "操作成功",
  code = 200
): {
  code: number
  data: T
  message: string
  success: boolean
} {
  return {
    code,
    data,
    message,
    success: code === 200,
  }
}

/**
 * 创建分页响应数据
 * @param list 列表数据
 * @param total 总条数
 * @param page 当前页
 * @param pageSize 每页条数
 */
export function createMockPageResponse<T = any>(
  list: T[],
  total: number,
  page = 1,
  pageSize = 10
): {
  code: number
  data: {
    list: T[]
    pagination: {
      current: number
      pageSize: number
      total: number
      totalPages: number
    }
  }
  message: string
  success: boolean
} {
  return createMockResponse({
    list,
    pagination: {
      current: page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}

export default Mock
