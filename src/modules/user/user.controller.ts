import { Controller, Get, Put, Session } from '@nestjs/common'
import { MySession } from 'src/type'

@Controller('user')
export class UserController {
  // 查询用户 info
  @Get('/info')
  getInfo(@Session() { userKey }: MySession): string {
    return 'This action returns info'
  }
  // 修改用户 info
  @Put('/info')
  updateInfo() {
    return 'this action update info'
  }

  // 查询用户好友列表
  @Get('/friends')
  getFriends() {
    return 'friends'
  }
  // 更新好友分组
  @Put('/friends/group')
  updateGroup() {}
}
