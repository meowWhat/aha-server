import { Body, Controller, Get, HttpStatus, Ip, Post, Query, Session, Put } from '@nestjs/common'
import { createOne, findByCondition, result, transaction, updateOne } from 'src/helper/sqlHelper'
import { USER, USER_ACCOUNT, USER_INFO } from 'src/db/tables'
import { eh } from 'src/helper/emailHelper'
import { getRandom, validateCode } from 'src/helper/utils'
import { Store } from 'src/helper/store'
import { sessionStore } from 'src/db/globalStore'
import { MySession } from 'src/type'
import { ParseBoolenPipe } from 'src/pipe/typeParser'
import { sessionTimeOut } from 'src/consts'

interface accountDto {
  email: string
  password: string
  code: string
}

@Controller('/register')
export class RegisterController {
  // 邮箱验证码缓存
  codeMap = new Store()
  // 对 ip 限制
  ipMap = new Store()

  /**
   * 创建用户
   */
  @Post()
  async create(@Body() { email, password, code }: accountDto, @Session() session: MySession) {
    // 校验邮箱
    const memoryCode = this.codeMap.get(email)
    if (memoryCode) {
      if (memoryCode === code) {
        // 创建用户
        let flag = true
        let rollback: any
        try {
          // 开启事务
          const cbs = await transaction()
          const commit = cbs.commit
          rollback = cbs.rollback

          // 创建用户账号
          const { insertId: tb_user_account } = await createOne(USER_ACCOUNT, { email, password })
          // 创建用户信息表
          const { insertId: tb_user_info } = await createOne(USER_INFO, { nickname: email, email })
          // 创建用户总表
          const { insertId: userId } = await createOne(USER, { tb_user_account, tb_user_info })

          // 顺利执行 提交
          await new Promise((resolve, reject) => {
            commit((err: any) => {
              if (!err) {
                resolve(null)
              } else {
                // 提交失败 回滚
                flag = false
                rollback()
                reject(err)
                cbs.release()
              }
            })
          })
          // 储存会话状态
          sessionStore.set(session.id, userId, sessionTimeOut)
          // 返回 sessionid
          session.userKey = session.id
          // 移除验证码
          this.codeMap.delete(email)
          return result(`用户${email}创建成功`, HttpStatus.OK)
        } catch (error) {
          if (flag) {
            // 创表错误 回滚
            rollback && rollback()
          }
          return result('创建用户失败' + error)
        }
      } else {
        return result('验证码错误')
      }
    } else {
      return result('邮箱验证码已失效')
    }
  }

  /**
   * 邮箱注册,获取验证码
   * 创建用户 发送验证码 ： isCreate  = true
   * 找回密码 发送验证码 ： isCreate = fasle
   */
  @Get()
  async getCode(
    @Query('isCreate', new ParseBoolenPipe()) isCreate: boolean,
    @Query('email') email: string,
    @Query('text') text: string,
    @Ip() ip: string,
  ) {
    // 对 IP 进行限制
    const lastReqTime = this.ipMap.get(ip)
    if (lastReqTime) {
      if (Date.now() - lastReqTime <= 1000 * 60) {
        return result('邮件六十秒内只允许发送一次')
      }
    }

    // 校验验证码
    const message = validateCode(text, ip)
    if (message) return message

    try {
      // 查询邮箱是否存在
      let res = null
      const row = await findByCondition(USER_ACCOUNT, { email })
      if (Array.isArray(row)) {
        if ((isCreate === true && row.length === 0) || (isCreate === false && row.length === 1)) {
          // 发送邮件
          const code = getRandom(6)
          this.ipMap.set(ip, Date.now(), 1000 * 60 * 2)
          await eh.send(email, code)
          res = result('邮件发送成功!', HttpStatus.OK)
          this.codeMap.set(email, code, 1000 * 60 * 10)
        } else {
          // 取消发送
          if (isCreate) {
            res = result('参数错误,用户邮箱已注册!')
          } else {
            res = result('参数错误,用户邮箱不存在!')
          }
        }
      } else {
        res = result('查询失败', HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return res
    } catch (error) {
      return result(error)
    }
  }

  /**
   * 找回密码
   */
  @Put('/forget')
  async forget(@Body() { email, password, code }: accountDto, @Session() session: MySession) {
    // 是否存储了 code
    const memoryCode = this.codeMap.get(email)
    if (!memoryCode) return result('邮箱验证码已失效')
    // code 是否正确
    if (memoryCode === code) {
      // 修改密码
      try {
        // 更新密码
        await updateOne(USER_ACCOUNT, { email }, { password })
        this.codeMap.delete(email)
        // 移除令牌(重新登陆)
        if (session.userKey) {
          session.userKey = null
          sessionStore.delete(session.id)
        }
        return result('修改密码成功', 200)
      } catch (error) {
        return result(error)
      }
    } else {
      return result('验证码错误')
    }
  }
}
