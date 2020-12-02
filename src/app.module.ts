import { Controller, Module, Get, Ip } from '@nestjs/common'
import { captchaStore } from './db/globalStore'
import { getCaptcha } from './helper/captcha'
import { result } from './helper/sqlHelper'

import { LoginModule } from './modules/Login/Login.module'

import { RegisterModule } from './modules/Register/Register.module'

@Controller('/app')
// 功能性路由
class AppControl {
  // 获取验证码
  @Get('/captcha')
  getCaptcha(@Ip() ip: string) {
    // 返回验证码
    const { text, svg } = getCaptcha()
    captchaStore.set(ip, text, 1000 * 60 * 2)
    return result({ text, svg }, 200)
  }
}

@Module({
  imports: [RegisterModule, LoginModule],
  controllers: [AppControl],
})
export class AppModule {}
