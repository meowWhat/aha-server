import { createHmac } from 'crypto'
import { captchaStore, sessionStore } from 'src/db/globalStore'
import { result } from './sqlHelper'

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

export const md5 = (data: string) => {
  const hmac = createHmac('sha1', 'ff@dah')
  return hmac.update(data).digest('base64')
}

/**
 * 校验验证码
 * @param text 验证码
 * @param ip ip地址
 */
export const validateCode = (text: string, ip: string) => {
  const answer: string = captchaStore.get(ip)
  if (!answer) {
    return result('图片验证码已过期')
  }
  if (answer.toLocaleLowerCase() === text.toLocaleLowerCase()) {
    captchaStore.delete(ip)
    return null
  } else {
    return result('图片验证码错误')
  }
}

/**
 * 添加前缀
 * @param tbname 表名
 */
export const addPrefix = (tbname: string, prefix = 'tb_') => {
  return `${prefix}${tbname}`
}

/**
 * 获取 userId
 */
export const getUseridBySessionKey = (userKey: string) => {
  const userId = sessionStore.get(userKey)
  if (!userId) {
    throw result('登录信息失效,请先登录')
  }
  return userId
}
