import { Body, Controller, Get, Put, Session } from '@nestjs/common'
import { USER_INFO } from 'src/db/tables'
import { findById, result, updateOne } from 'src/helper/sqlHelper'
import { addPrefix } from 'src/helper/utils'
import { MySession } from 'src/type'
import { UserService } from './User.service'

@Controller('user')
export class UserController {
  service: UserService
  constructor(service: UserService) {
    this.service = service
  }
  // 查询用户 info
  @Get('/info')
  async getInfo(@Session() { userKey }: MySession) {
    try {
      const userInfoId = await this.service.findColumnFromUserTb(userKey, addPrefix(USER_INFO))
      const infoRow = await findById(USER_INFO, userInfoId)
      return result(infoRow, 200)
    } catch (error) {
      return result(error)
    }
  }

  // 修改用户 info
  @Put('/info')
  async updateInfo(@Body() data: {}, @Session() { userKey }: MySession) {
    try {
      const userInfoId = await this.service.findColumnFromUserTb(userKey, addPrefix(USER_INFO))
      const res = await updateOne(USER_INFO, { id: userInfoId }, data)
      return result(res, 200)
    } catch (error) {
      return result(error)
    }
  }

  // 查询用户好友列表
  @Get('/friends')
  async getFriends(@Session() { userKey }: MySession) {}
  // 更新好友列表
  @Put('/friends')
  updateGroup() {}
}
