import { Controller, Get, Session, Post, Put, Body, Delete } from '@nestjs/common'
import { userAdderStore } from 'src/db/globalStore'
import { USER, USER_ACCOUNT, USER_RELATION } from 'src/db/tables'
import { createOne, deleteOne, findByCondition, result, updateOne } from 'src/helper/sqlHelper'
import { addPrefix, getRandom, getUseridBySessionKey } from 'src/helper/utils'
import { MySession } from 'src/type'

@Controller('friend')
export class FriendController {
  friend_id = 'friend_id'
  user_id = 'user_id'

  // 查询用户好友列表
  @Get()
  async getFriends(@Session() { userKey }: MySession) {
    try {
      const userId = getUseridBySessionKey(userKey)
      const row1 = await findByCondition(USER_RELATION, { [this.friend_id]: userId }, [this.user_id])
      const row2 = await findByCondition(USER_RELATION, { [this.user_id]: userId }, [this.friend_id])
      return result([...row1, ...row2], 200)
    } catch (error) {
      return result(error)
    }
  }

  // 添加好友 => 发起邀请
  @Post('/invite')
  async inviteFriend(@Body('email') email: string, @Session() { userKey }: MySession) {

    const checkRow = (row: any) => {
      return Array.isArray(row) && row.length === 1 && row[0].id
    }

    try {
      const row1 = await findByCondition(USER_ACCOUNT, { email }, ['id'])
      if (checkRow(row1)) {
        // 好友账号 ID
        const fAccountId = row1[0].id
        // 好友 userID
        const row2 = await findByCondition(USER, { [addPrefix(USER_ACCOUNT)]: fAccountId }, ['id'])

        if (checkRow(row2)) {
          const fUserId = row2[0].id
          const random = getRandom(10)
          const userId = getUseridBySessionKey(userKey)
          if (userId === fUserId) {
            return result('不能添加自己为好友！')
          }
          // 储存添加状态 
          userAdderStore.set(random, userId)

          return result({ friendId: fUserId, key: random }, 200)
        }
      }

      return result('邮箱错误,未查询到用户')

    } catch (error) {
      return result(error)
    }
  }

  // 添加好友 => 会话应答
  @Post()
  async createFriend(@Body('key') key: string, @Session() { userKey }: MySession) {
    try {
      const fUserId = getUseridBySessionKey(userKey)
      const userId = userAdderStore.get(key)
      if (!userId) {
        return result('好友添加已过期')
      }
      // 添加好友
      await createOne(USER_RELATION, { [this.user_id]: userId, [this.friend_id]: fUserId })
      userAdderStore.delete(userId)
      return result('好友添加成功', 200)
    } catch (error) {
      return result(error)
    }
  }

  // 更新好友列表 (分组,权限)
  @Put()
  async updateFriend(@Session() { userKey }: MySession, @Body() body: {}) {
    try {
      if (body[this.friend_id] || body[this.user_id] || body['id']) {
        return result('参数错误,用户id不能修改')
      }
      // 权限问题 [ todo ]

      const userId = getUseridBySessionKey(userKey)
      await updateOne(USER_RELATION, { [this.friend_id]: userId }, body)
      await updateOne(USER_RELATION, { [this.user_id]: userId }, body)

      return result('好友添加成功', 200)
    } catch (error) {
      return result(error)
    }
  }

  // 删除好友
  @Delete()
  async deleteFriend(@Session() { userKey }: MySession, @Body('friend_id') fUserId: string) {
    try {
      const userId = getUseridBySessionKey(userKey)
      await deleteOne(USER_RELATION, { [this.user_id]: userId, [this.friend_id]: fUserId })
      await deleteOne(USER_RELATION, { [this.friend_id]: userId, [this.user_id]: fUserId })
      return result('好友删除成功', 200)
    } catch (error) {
      return result(error)
    }
  }
}
