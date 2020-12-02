import { Body, Controller, Ip, Post, Session } from '@nestjs/common'
import { sessionStore } from 'src/db/globalStore'
import { USER_ACCOUNT } from 'src/db/tables'
import { findByCondition, result } from 'src/helper/sqlHelper'
import { validateCode } from 'src/helper/utils'
import { MySession } from 'src/type'

interface LoginDto {
  // 邮箱
  email: string
  // 密码
  password: string
  // 验证码
  text: string
}

@Controller('login')
export class LoginController {
  // 用户登录
  @Post()
  async login(@Body() { email, password, text }: LoginDto, @Ip() ip: string, @Session() session: MySession) {
    // 校验验证码
    const message = validateCode(text, ip)
    if (message) return message

    // 校验账号,密码
    const res = await findByCondition(USER_ACCOUNT, { email, password })
    if (res) {
      // 登陆失败
      return result('账号或密码错误,请重新输入.')
    }
    // 登录成功
    // 发送令牌
    session.userKey = session.id
    // 保存登录态
    sessionStore.set(session.id, 'userid')

    return result('登陆成功', 200)
  }
}
