import { Controller, Module, Get, Param, Ip } from '@nestjs/common'
import { getCaptcha } from './helper/captcha'
import { result } from './helper/sqlHelper'
import { Store } from './helper/store'

import { RegisterModule } from './modules/Register/Register.module'

@Controller('/app')
// 功能性路由
class AppControl {
  captchaMap = new Store()
  // 获取验证码
  @Get('/captcha')
  getCaptcha(@Ip() ip: string) {
    // 返回验证码
    const { text, svg } = getCaptcha()
    this.captchaMap.set(ip, text, 1000 * 60 * 2)
    return result({ text, svg }, 200)
  }
  // 校验验证码
  @Get('/captcha/:text')
  validateCaptcha(@Ip() ip: string, @Param('text') text: string) {
    const answer = this.captchaMap.get(ip)
    if (!answer) {
      return result('验证码已过期')
    }
    if (answer === text) {
      this.captchaMap.delete(ip)
      return result('验证码正确', 200)
    } else {
      return result('验证码错误')
    }
  }
}

@Module({
  imports: [RegisterModule],
  controllers: [AppControl],
})
export class AppModule {}
