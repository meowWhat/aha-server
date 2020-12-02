import { Controller, Module, Get, Session, Param } from '@nestjs/common'
import { getCaptcha } from './helper/captcha'
import { result } from './helper/sqlHelper'

import { RegisterModule } from './modules/Register/Register.module'
import { MySession } from './type'

@Controller('/app')
// 功能性路由
class AppControl {
  // 获取验证码
  @Get('/captcha')
  getCaptcha(@Session() session: MySession) {
    // 返回验证码
    const { text, svg } = getCaptcha()
    session.captcha = text
    return result({ text, svg }, 200)
  }
  // 校验验证码
  @Get('/captcha/:text')
  validateCaptcha(@Session() session: MySession, @Param('text') text: string) {
    const answer = session.captcha
    if (answer === text) {
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
