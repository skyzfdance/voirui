import { createApp } from "vue"
import { createPinia } from "pinia"
import "/@/assets/less/tailwind.less"

import App from "./App.vue"
import { router, setupRouter } from "./router"
import { setupGlobDirectives } from "./directives"
import { initAppConfigStore } from "./logics/initAppConfig"
import { setupMock } from "./utils/mock"

import { setupRouterGuard } from "./router/guard"

function main() {
  // 初始化 Mock（仅在开发环境）
  setupMock()

  const app = createApp(App)

  app.use(createPinia())

  initAppConfigStore()

  setupRouter(app)

  setupRouterGuard(router)

  setupGlobDirectives(app)

  app.mount("#app")
}

main()
