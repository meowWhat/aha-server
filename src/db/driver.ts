import { createPool, Pool } from 'mysql'
import { configHelper } from 'src/helper/configHelper'

class MysqlDriver {
  public pool: Pool
  /**
   * 执行 sql 语句
   * @param sql sql语句
   * @param values 插值
   * @example var sql = "SELECT * FROM ?? WHERE ?? = ?";
              var inserts = ['users', 'id', userId];
   */
  query(sql: string, values: any[]): Promise<any> {

    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, db) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        // 格式化 sql 语句
        const formatSql = db.format(sql, values)
        db.query(formatSql, (err, row) => {
          if (err) {
            reject(err)
          } else {
            resolve(row)
            db.release()
          }
        })
      })

    })
  }

  /**
   * 连接数据库
   */
  connect() {
    const config = configHelper.readConfig(configHelper.MysqlConfigPath)
    try {
      this.pool = createPool(config)
      console.log('数据库连接成功!'.green)
    } catch (err) {
      console.log(`数据库连接失败,错误信息[ ${err} ]`.red)
    }
  }

}
const db = new MysqlDriver()

export { db }
