---
name: router-architecture
description: Vue Router 架构设计与优化，适用于基于 Vue 3 + Vue Router 4 的中后台管理系统。当需要设计、重构或优化路由系统时使用。
---

# Vue Router 架构设计

## 目录结构规范

```
src/router/
├── guard/                    # 路由守卫
│   ├── index.ts             # 守卫入口，统一注册
│   └── permissionGuard.ts   # 权限守卫（核心）
├── modules/                 # 业务路由模块
│   ├── dashboard.ts
│   └── ...
├── constant.ts              # 静态路由定义
├── index.ts                 # 路由实例创建与重置
├── menuHelper.ts            # 路由与菜单转换工具
├── routes.ts                # 路由数据整合
└── types.ts                 # 类型定义
```

## 核心设计原则

### 1. 守卫合并原则

**优化前（分散）：**
```typescript
// 避免：每个守卫单独注册
function createHttpGuard(router: Router) { /* ... */ }
function createMessageGuard(router: Router) { /* ... */ }
function createScrollGuard(router: Router) { /* ... */ }
function createStateGuard(router: Router) { /* ... */ }
```

**优化后（按时机合并）：**
```typescript
// 推荐：按 beforeEach/afterEach 合并
function createBeforeEachGuard(router: Router) {
  router.beforeEach(() => {
    http.cancelAll()
    message.destroy()
    Modal.destroyAll()
    notification.destroy()
  })
}

function createAfterEachGuard(router: Router) {
  router.afterEach((to) => {
    window.scrollTo(0, 0)
    if (to.path === "/login") {
      // 清理状态
    }
  })
}
```

### 2. 路由分类

| 类型 | 位置 | 说明 |
|------|------|------|
| 静态路由 | `constant.ts` | 登录、404、重定向等基础路由 |
| 动态路由 | `modules/*.ts` | 业务模块路由，自动收集 |
| 异步路由 | `routes.ts` | 需要权限验证后动态添加 |

### 3. 模块自动收集

```typescript
// routes.ts
function loadRouteModules(): MergedRoute[] {
  const modules = import.meta.glob<{ default: MergedRoute | MergedRoute[] }>(
    "./modules/*.ts", 
    { eager: true }
  )

  return Object.values(modules).flatMap((mod) => {
    const route = mod.default
    return Array.isArray(route) ? route : [route]
  })
}
```

## 权限守卫流程

```
1. 获取 Token
   ↓
2. 登录页特殊处理
   ↓
3. 无 Token → 跳转登录
   ↓
4. 已添加动态路由 → 直接放行
   ↓
5. 获取用户信息
   ↓
6. 构建并添加路由
   ↓
7. 重新导航
```

## 路由类型定义

```typescript
// types.ts
export interface MergedRoute extends Omit<RouteRecordRaw, "meta"> {
  name: RouteRecordName
  meta: RouteMeta
  component?: () => Promise<typeof import("*.vue")>
  children?: MergedRoute[]
}
```

## 最佳实践

1. **守卫顺序**：清理守卫 → 权限守卫（确保先清理再判断）
2. **空守卫删除**：未实现的守卫直接删除，保留空文件
3. **未使用代码清理**：如 `EXCEPTION_ROUTE` 未使用则删除
4. **白名单机制**：重置路由时保护静态路由

## 文件变更记录

### 优化内容汇总

| 文件 | 变更 |
|------|------|
| `guard/index.ts` | 4个守卫合并为2个，按 beforeEach/afterEach 分组 |
| `guard/paramMenuGuard.ts` | 删除（空实现） |
| `constant.ts` | 删除未使用的 `EXCEPTION_ROUTE` |
| `routes.ts` | 简化模块导入逻辑，使用 `flatMap` |
