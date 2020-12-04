import { CaptchaObj, create, createMathExpr } from 'svg-captcha'
import { getRandom } from './utils'

/**
 * 获得随机验证码
 */
export const getCaptcha = () => {
  let random = Number.parseInt(getRandom(2))
  let captch: CaptchaObj = null
  if (random > 50) {
    captch = createMathExpr({
      mathMin: 0,
      mathMax: 20,
      color: true,
      noise: 5,
      height: 44,
    })
  } else {
    captch = create({
      size: 6,
      noise: 5,
      color: true,
    })
  }

  return {
    text: captch.text,
    svg: captch.data,
  }
}
