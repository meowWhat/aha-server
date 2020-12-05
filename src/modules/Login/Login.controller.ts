import { Body, Controller, Get, Post, Session } from '@nestjs/common'
import { sessionTimeOut } from 'src/consts'
import { sessionStore } from 'src/db/globalStore'
import { USER, USER_ACCOUNT } from 'src/db/tables'
import { findByCondition, result } from 'src/helper/sqlHelper'
import { getUseridBySessionKey } from 'src/helper/utils'
import { MySession } from 'src/type'

interface LoginDto {
  // 邮箱
  email: string
  // 密码
  password: string
  // 验证码
  text: string
}
type row = { id: number }[]

@Controller('login')
export class LoginController {
  // 用户登录
  @Post()
  async login(@Body() { email, password }: LoginDto, @Session() session: MySession) {
    // 校验账号,密码
    try {
      const accountRow: row = await findByCondition(USER_ACCOUNT, { email, password })
      if (accountRow.length === 0) {
        // 账号密码错误
        return result('账号或密码错误,请重新输入!')
      }
      const userRow: row = await findByCondition(USER, { tb_user_account: accountRow[0].id })
      // 登录成功
      // 发送令牌
      session.userKey = session.id
      // 保存登录态
      sessionStore.set(session.id, userRow[0].id, sessionTimeOut)
      return result('登陆成功', 200)
    } catch (error) {
      return result(error)
    }
  }

  // 确认登录态
  @Get()
  async isLogin(@Session() session: MySession) {
    try {
      getUseridBySessionKey(session.userKey)
      return result('用户已登录', 200)
    } catch (error) {
      result(error)
    }
  }
}
