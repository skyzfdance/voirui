export interface Cache<T = any> {
  value: T;
  timeoutId?: ReturnType<typeof setTimeout>;   // 利用一下 ReturnType 获取 setTimeout 的返回值类型，这里是 NodeJS.Timeout，个人感觉吧，没啥太多的意义，可以直接写 number
  time?: number;
  alive?: number;
}

/** 未过期 */
const NOT_ALIVE = 0

export class Memory<T = any, V = any> {
  private cache: { [key in keyof T]?: Cache<V> } = {}
  private readonly alive: number

  constructor(alive = NOT_ALIVE) {
    this.alive = alive * 1000
  }

  get getCache() {
    return this.cache
  }

  setCache(cache: { [key in keyof T]?: Cache<V> }) {
    this.cache = cache
  }

  /**
   * 获取缓存
   * @param key
   */
  get<K extends keyof T>(key: K) {
    return this.cache[key]
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param expires 过期时间，单位秒
   */
  set<K extends keyof T>(key: K, value: V, expires?: number) {
    let item = this.get(key)

    if (!expires || expires <= 0) {
      expires = this.alive
    }

    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId)
        item.timeoutId = undefined
      }
      item.value = value
    } else {
      item = { value, alive: expires }
      this.cache[key] = item
    }

    // 这里是一个回退逻辑，如果 expires 为 0，则意味着缓存项永久有效，因此直接返回 value。
    if (!expires) return value

    const now = new Date().getTime()

    /**
     * 需要防止定时器最大值溢出
     * 1. 如果 expires > now，则表示 expires 是一个未来的时间戳，因此需要减去当前时间戳，得到一个相对时间
     * 2. 如果 expires <= now，则表示 expires 是一个相对时间，因此直接使用 expires
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout#%E6%9C%80%E5%A4%A7%E5%BB%B6%E6%97%B6%E5%80%BC
     */
    item.time = expires > now ? expires : now + expires
    item.timeoutId = setTimeout(() => {
      this.remove(key)
    }, expires > now ? expires - now : expires)

    return value
  }

  /**
   * 移除缓存
   * @param key 需要移除的缓存键
   */
  remove<K extends keyof T>(key: K) {
    const item = this.get(key)
    Reflect.deleteProperty(this.cache, key)
    if (item) {
      clearTimeout(item.timeoutId)
      return item.value
    }
  }

  /**
   * 重置缓存
   * @param cache
   */
  resetCache(cache: { [K in keyof T]: Cache }) {
    Object.keys(cache).forEach((key) => {
      const k = key as keyof T
      const item = cache[k]
      if (item && item.time) {
        const now = new Date().getTime()
        const expire = item.time
        if (expire > now) {
          this.set(k, item.value, expire)
        }
      }
    })
  }

  /**
   * 清除所有缓存
   */
  clear() {
    // 必须清除所有的定时器，否则会造成内存泄漏
    Object.keys(this.cache).forEach((key) => {
      const item = this.cache[key]
      item.timeoutId && clearTimeout(item.timeoutId)
    })
    this.cache = {}
  }
}