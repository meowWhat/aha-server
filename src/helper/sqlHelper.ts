import { HttpStatus } from '@nestjs/common'
import { db } from '../db/driver'

/**
 * 基础的创建
 * @param tb 表名称
 * @param param 插入的键值对
 */
export const createOne = (tb: string, param: { [key: string]: string | number }) => {
  let keyPlace = ''
  let valuePlace = ''
  const keys = Object.keys(param)
  const values = keys.map((key) => param[key])
  const len = keys.length

  for (let index = 0; index < len; index++) {
    if (index === len - 1) {
      keyPlace += '??'
      valuePlace += '?'
    } else {
      keyPlace += '??,'
      valuePlace += '?,'
    }
  }

  const sql = `INSERT INTO ?? (${keyPlace}) VALUES (${valuePlace})`

  return db.query(sql, [tb, ...keys, ...values])
}

/**
 * 查找所有数据
 * @param tb  表名
 */
export const findAll = (tb: string) => {
  return db.query(`SELECT * FROM ??`, [tb])
}

/**
 * 根据 id 查找
 * @param tb 表名
 * @param id id
 */
export const findById = (tb: string, id: number | string) => {
  return db.query(`SELECT * FROM ?? where id = ?`, [tb, id])
}

/**
 * 条件查询
 * @param tb 表名
 * @param condition 条件 { 'name' : '张三' , 'age':['>=',20] }
 */

export const findByCondition = (
  tb: string,
  condition: {
    [key: string]: string | number | [string, string | number]
  },
) => {
  let cond = ''
  let values = []
  const keys = Object.keys(condition)
  keys.forEach((key, index) => {
    let value = condition[key]
    let operator = '='

    // value允许数组含操作符['>=' , 'xxx']
    if (Array.isArray(value) && value.length === 2) {
      operator = value[0]
      value = value[1]
    }

    if (keys.length - 1 === index) {
      cond += `?? ${operator} ?`
    } else {
      cond += `?? ${operator} ? AND`
    }

    values.push(key, value)
  })

  return db.query(`SELECT * FROM ?? WHERE ${cond} `, [tb, ...values])
}

/**
 * 统一返回结果
 * @param code 状态码
 * @param message 信息
 */
export const result = (message: any, code = HttpStatus.BAD_REQUEST) => {
  return {
    statusCode: code,
    message,
  }
}

/**
 * 事务
 */
export const transaction = (): Promise<{ rollback: any; commit: any }> => {
  return new Promise((resolve, reject) => {
    db.db.beginTransaction((err) => {
      if (err) {
        reject(err)
      }
      resolve({
        rollback: db.db.rollback.bind(db.db),
        commit: db.db.commit.bind(db.db),
      })
    })
  })
}
