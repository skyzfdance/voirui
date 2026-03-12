/**
 * @file 全局指令
 */

import type { App } from "vue"
import { setupLoadingDirective } from "./loading"
import { permission } from "./permission"

export function setupGlobDirectives(app: App) {
  setupLoadingDirective(app)
  // 注册权限指令
  app.directive("permission", permission)
}
