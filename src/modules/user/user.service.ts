import { Injectable } from '@nestjs/common'

import { USER } from 'src/db/tables'
import { findById } from 'src/helper/sqlHelper'
import { getUseridBySessionKey } from 'src/helper/utils'

@Injectable()
export class UserService {
  /**
   * 从 user 表获取列
   * @param userKey key of session
   * @param column 表名
   */
  async findColumnFromUserTb(userKey: string, column: string) {
    const userId = getUseridBySessionKey(userKey)
    const userRow: {}[] = await findById(USER, userId)
    return userRow[0][column]
  }
}
