/**
 * @file user.ts
 * @module utils/mock/modules
 * @description 用户相关 Mock 数据
 */

import type MockType from "mockjs"
import { createMockResponse, createMockPageResponse, logMockRequest } from "../index"

export default function (Mock: typeof MockType) {
  // 登录
  Mock.mock(/\/api\/auth\/login/, "post", (options) => {
    const { account, password } = JSON.parse(options.body)

    // 简单的账号密码验证（演示用）
    const validAccounts = ["admin", "user", "test"]
    const isValid = validAccounts.includes(account) && password === "123456"

    if (!isValid) {
      const response = {
        code: 401,
        message: "账号或密码错误",
        success: false,
        data: null,
      }
      logMockRequest("POST", "/api/auth/login", options.body, response)
      return response
    }

    const response = createMockResponse({
      accessToken: Mock.Random.guid(),
      refreshToken: Mock.Random.guid(),
      expires: Date.now() + 2 * 60 * 60 * 1000, // 2小时过期（便于测试）
    })
    logMockRequest("POST", "/api/auth/login", options.body, response)
    return response
  })

  // 获取当前用户信息
  Mock.mock(/\/api\/user\/info/, "get", () => {
    const response = createMockResponse({
      id: Mock.Random.id(),
      username: "admin",
      nickname: Mock.Random.cname(),
      avatar: Mock.Random.image("100x100", "#4A90E2", "User"),
      email: Mock.Random.email(),
      phone: Mock.Random.string("number", 11),
      roles: ["admin"],
      permissions: ["*"],
      department: "技术部",
      createTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    })
    logMockRequest("GET", "/api/user/info", null, response)
    return response
  })

  // 获取用户列表
  Mock.mock(/\/api\/user\/list/, "get", (options) => {
    const url = new URL(options.url, "http://localhost")
    const page = parseInt(url.searchParams.get("page") || "1")
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10")

    const list = Array.from({ length: pageSize }, () => ({
      id: Mock.Random.id(),
      username: Mock.Random.word(6, 12),
      nickname: Mock.Random.cname(),
      avatar: Mock.Random.image("100x100", "#4A90E2", "User"),
      email: Mock.Random.email(),
      phone: Mock.Random.string("number", 11),
      status: Mock.Random.pick([0, 1]),
      roles: Mock.Random.pick([["admin"], ["user"], ["editor"]]),
      department: Mock.Random.pick(["技术部", "产品部", "运营部", "市场部"]),
      createTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    }))

    return createMockPageResponse(list, 100, page, pageSize)
  })

  // 创建用户
  Mock.mock(/\/api\/user/, "post", (options) => {
    const data = JSON.parse(options.body)
    return createMockResponse({
      id: Mock.Random.id(),
      ...data,
      createTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    })
  })

  // 更新用户
  Mock.mock(/\/api\/user\/\w+/, "put", (options) => {
    const data = JSON.parse(options.body)
    return createMockResponse({
      ...data,
      updateTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    })
  })

  // 删除用户
  Mock.mock(/\/api\/user\/\w+/, "delete", () => {
    return createMockResponse(null, "删除成功")
  })

  // 退出登录
  Mock.mock(/\/api\/auth\/logout/, "post", () => {
    return createMockResponse(null, "退出成功")
  })

  // 刷新 token
  Mock.mock(/\/api\/auth\/refresh/, "post", (options) => {
    const response = createMockResponse({
      accessToken: Mock.Random.guid(),
      refreshToken: Mock.Random.guid(),
      expires: Date.now() + 2 * 60 * 60 * 1000, // 2小时过期
    })
    logMockRequest("POST", "/api/auth/refresh", options.body, response)
    return response
  })
}
