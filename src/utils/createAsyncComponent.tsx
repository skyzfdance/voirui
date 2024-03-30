/**
 * @file 创建异步组件加载器
 * @module utils/createAsyncComponent
 */

// TODO: 当前未通过测试用例，不知道如何编写测试用例

import { type AsyncComponentLoader, type Component, type ComponentPublicInstance, defineAsyncComponent } from "vue"

import { Spin } from "ant-design-vue"

interface Options {
  /**
   * loading 大小
   * @default small
   */
  size?: "default" | "small" | "large"
  /**
   * 组件加载延迟时间
   * @default 200
   */
  delay?: number
  /**
   * 组件加载成功前 是否显示loading
   * @default false
   */
  loading?: boolean
  /**
   * 是否需要进入重试机制
   * @default true
   */
  retry?: boolean
}

/**
 * 创建异步组件加载器
 * @param loader 需要加载的组件
 * @param options 加载配置
 * @returns
 */
export function createAsyncComponent<
  T extends Component = {
    new (): ComponentPublicInstance
  },
>(loader: AsyncComponentLoader<T>, options: Options = {}): T {
  const { size = "small", delay = 200, loading = true, retry = true } = options

  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? <Spin spinning={true} size={size} /> : undefined,
    delay,
    onError: !retry
      ? () => {}
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            retry()
          } else {
            fail()
          }
        },
  })
}
