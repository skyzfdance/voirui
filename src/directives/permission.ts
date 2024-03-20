/**
 * @file v-auth 权限指令
 */

import { type DirectiveBinding, type App, type Directive } from "vue"

function isAuth(el: Element, binding: DirectiveBinding) {}

const authDirective: Directive = {
  mounted(el, binding) {
    return isAuth(el, binding)
  },
}

export function setupPermissionDirective(app: App) {
  app.directive("auth", authDirective)
}

export default authDirective
