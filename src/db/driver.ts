import { createConnection, Connection } from 'mysql'
import * as fs from 'fs'
import * as path from 'path'
class MysqlDriver {
  db: Connection
  /**
   * 执行 sql 语句
   * @param sql sql语句
   * @param values 插值
   * @example var sql = "SELECT * FROM ?? WHERE ?? = ?";
              var inserts = ['users', 'id', userId];
   */
  query(sql: string, values: any[]): Promise<any> {
    // 格式化 sql 语句
    const formatSql = this.db.format(sql, values)
    return new Promise((resolve, reject) => {
      this.db.query(formatSql, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  /**
   * 连接数据库
   */
  connect() {
    const config = {}
    fs.readFileSync(path.join(process.cwd(), '.config'))
      .toString()
      .split('\n')
      .forEach((item) => {
        const splits = item.split(':')
        config[splits[0]] = splits[1]
      })

    this.db = createConnection(config)
    this.db.connect((err) => {
      if (err) {
        console.log(`数据库连接失败,错误信息[ ${err} ]`.red)
      } else {
        console.log('数据库连接成功!'.green)
      }
    })
  }

  /**
   * 结束 db 连接
   */
  end() {
    this.db.end((err) => {
      if (err) {
        console.log(`数据库断开连接失败,错误信息[ ${err} ]`.red)
      } else {
        console.log('数据库断开连接成功!'.green)
      }
    })
  }
}
const db = new MysqlDriver()

export { db }
