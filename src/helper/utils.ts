/**
 * 获取指定长度的随机数
 * @param len 长度
 */
export const getRandom = (len: number) => {
  let res = ''
  for (let index = 0; index < len; index++) {
    res += Math.floor(Math.random() * 10)
  }
  return res
}
