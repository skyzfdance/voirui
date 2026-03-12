---
name: http
description: HTTP 请求封装模块，基于 Axios 实现，支持请求/响应拦截、Token 自动刷新、请求取消、文件上传、SSE 等功能。用于处理所有后端 API 通信。
---

# HTTP 请求模块

## 模块结构

```
utils/http/
├── types.ts          # 类型定义
├── Axios.ts          # Axios 封装类
├── axiosTransform.ts # 转换钩子实现
└── index.ts          # 模块入口
```

## 快速使用

### 基础请求

```typescript
import { http } from "/@/utils/http"

// GET 请求
const data = await http.get("/api/users", { params: { page: 1 } })

// POST 请求
const result = await http.post("/api/users", { name: "张三" })

// PUT 请求
await http.put("/api/users/1", { name: "李四" })

// DELETE 请求
await http.delete("/api/users/1")
```

### 文件上传

```typescript
// 单文件上传
await http.upload("/api/upload", file, "file")

// 多文件上传
await http.upload("/api/upload", [file1, file2], "files", { category: "avatar" })
```

### SSE 请求

```typescript
const controller = http.requestSSE(
  { url: "/api/sse", method: "GET" },
  {
    onMessage: (data) => console.log(data),
    onError: (error) => console.error(error),
    onComplete: () => console.log("完成"),
  }
)

// 取消连接
controller.abort()
```

## 请求配置选项

```typescript
interface RequestOptions {
  joinPrefix?: boolean           // 是否添加 urlPrefix
  isReturnNativeResponse?: boolean // 返回原生响应
  isTransformResponse?: boolean  // 是否转换响应数据
  errorMessageMode?: ErrorMessageMode // 错误提示方式
  ignoreCancelToken?: boolean    // 是否忽略取消令牌
  withToken?: boolean            // 是否携带 token
  retryRequest?: RetryRequest    // 重试配置
}
```

## Token 自动刷新机制

### 工作原理

1. **过期检查**：每次请求前检查 token 是否即将过期（提前 5 分钟）
2. **自动刷新**：触发 `/api/auth/refresh` 接口获取新 token
3. **并发控制**：使用订阅者模式防止重复刷新
4. **失败处理**：刷新失败自动跳转到登录页

### 刷新流程

```
请求发起 → 检查 expires → 即将过期?
  ↓ 是
调用 /api/auth/refresh → 更新缓存 → 继续请求
  ↓ 否
直接携带当前 token 请求
```

### 相关配置

```typescript
// 缓存 key
CacheTypeEnum.TOKEN_KEY          // accessToken
CacheTypeEnum.REFRESH_TOKEN_KEY  // refreshToken
CacheTypeEnum.TOKEN_EXPIRES_KEY  // 过期时间戳
```

## 扩展 Axios 类

```typescript
import { VAxios } from "/@/utils/http"

const customHttp = new VAxios({
  baseURL: "/api",
  timeout: 10000,
  requestOptions: {
    withToken: true,
    retryRequest: {
      isOpenRetry: true,
      count: 3,
      waitTime: 100,
    },
  },
})
```

## 添加 Mock 接口

```typescript
// utils/mock/modules/xxx.ts
import type MockType from "mockjs"
import { createMockResponse } from "../index"

export default function (Mock: typeof MockType) {
  Mock.mock(/\/api\/example/, "get", () => {
    return createMockResponse({ data: "test" })
  })
}
```

## 注意事项

1. **响应格式**：后端需返回 `{ code, data, message, success }` 标准格式
2. **Token 存储**：通过缓存工具自动持久化到 localStorage/sessionStorage
3. **请求取消**：组件卸载时调用 `http.cancelAll()` 取消未完成的请求
4. **错误处理**：默认使用 `message.error()` 显示错误，可通过 `errorMessageMode` 配置
