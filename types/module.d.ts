/**
 * @file types/module.d.ts
 * @module types/module
 * @description Module type declaration
 */

declare module "*.vue" {
  import { DefineComponent } from "vue"
  const Component: DefineComponent<{}, {}, any>
  export default Component
}
