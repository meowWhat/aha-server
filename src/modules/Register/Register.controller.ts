import { Body, Controller, Delete, Get, HttpStatus, Ip, Param, Post, Put } from '@nestjs/common'
import { createOne, findByCondition, result } from 'src/helper/sqlHelper'
import { USER_ACCOUNT } from 'src/db/tables'
import { eh } from 'src/helper/emailHelper'
import { getRandom } from 'src/helper/utils'

interface CreateDto {
  email: string
  password: string
  code: string
}

@Controller('/register')
export class RegisterController {
  codeMap: Map<string, string> = new Map()
  ipMap: Map<string, number> = new Map()

  /**
   * 创建用户
   */
  @Post()
  async create(@Body() { email, password, code }: CreateDto) {
    // 校验邮箱
    const memoryCode = this.codeMap.get(email)
    if (memoryCode) {
      if (memoryCode === code) {
        // 创建用户
        try {
          await createOne(USER_ACCOUNT, { email, password })
          // 生成 token
          return result(`创建成功`, HttpStatus.OK)
        } catch (error) {
          return result(error)
        }
      } else {
        return result('验证码错误')
      }
    } else {
      return result('验证码已失效')
    }
  }

  /**
   * 邮箱注册,获取验证码
   */
  @Get(':email')
  async getCode(@Param('email') email: string, @Ip() ip: string) {
    // 对 IP 进行限制
    const lastReqTime = this.ipMap.get(ip)
    if (lastReqTime) {
      if (Date.now() - lastReqTime <= 1000 * 60) {
        return result('邮件六十秒内只允许发送一次')
      }
    }
    try {
      // 查询邮箱是否存在
      let res = null
      const row = await findByCondition(USER_ACCOUNT, { email })
      if (Array.isArray(row) && row.length === 0) {
        // 不存在邮箱 => 发送邮件
        const code = getRandom(6)
        this.codeMap.set(email, code)
        await eh.send(email, code)
        res = result('邮件发送成功!', HttpStatus.OK)
        this.ipMap.set(ip, Date.now())
        setTimeout(() => {
          // 设置过期时间
          this.ipMap.delete(ip)
        }, 1000 * 60 * 10)
      } else {
        res = result('参数错误,邮箱已注册!')
      }
      return res
    } catch (error) {
      return result(error)
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto) {
    return `This action updates a #${id} cat`
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`
  }
}
