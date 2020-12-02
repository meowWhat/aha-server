import { Injectable } from '@nestjs/common'
import { sessionStore } from 'src/db/globalStore'
import { USER } from 'src/db/tables'
import { findById, result } from 'src/helper/sqlHelper'

@Injectable()
export class UserService {
  /**
   * 从 user 表获取列
   * @param userKey key of session
   * @param column 表名
   */
  async findColumnFromUserTb(userKey: string, column: string) {
    const userId = sessionStore.get(userKey)
    if (!userId) {
      throw result('登录信息失效,请先登录')
    }
    const userRow: {}[] = await findById(USER, userId)
    return userRow[0][column]
  }
}
