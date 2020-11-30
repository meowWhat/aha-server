export class Store {
  data = new Map<string, any>()

  /**
   *  储存
   * @param key 键名
   * @param value 值
   * @param timeOut 过期时间
   */

  set(key: string, value: any, timeOut: number = 1000 * 60 * 60) {
    // 储存
    this.data.set(key, value)
    // 自动过期
    setTimeout(() => {
      this.data.delete(key)
    }, timeOut)
  }

  get(key: string): any {
    return this.data.get(key)
  }

  delete(key: string) {
    this.data.delete(key)
  }

  clear() {
    this.data.clear()
  }
}
