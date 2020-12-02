import { HttpStatus } from '@nestjs/common'
import { db } from '../db/driver'

/**
 * 转换条件
 * @param obj 对象
 * @example parserCondition({id:1,age:["<=",20]})
 *  result : { place : "?? = ? AND ?? <= ?" ,values:[id,1,age,20]
 */
const parserCondition = (obj: Object) => {
  const keys = Object.keys(obj)

  let place = ''
  let values = []

  keys.forEach((key, index) => {
    let value = obj[key]
    let operator = '='

    // value允许数组含操作符['>=' , 'xxx']
    if (Array.isArray(value) && value.length === 2) {
      operator = value[0]
      value = value[1]
    }

    if (keys.length - 1 === index) {
      place += `?? ${operator} ?`
    } else {
      place += `?? ${operator} ? AND`
    }

    values.push(key, value)
  })

  return {
    place,
    values,
  }
}

/**
 * 转换data
 * @param obj 对象
 * @example parserData({id:1,age:2})
 *  result : { place : "?? = ? ,?? = ?" ,values:[id,1,age,2]
 */
const parserData = (obj: Object) => {
  const keys = Object.keys(obj)

  let place = ''
  let values = []

  keys.forEach((key, index) => {
    let value = obj[key]
    let operator = '='

    if (keys.length - 1 === index) {
      place += `?? ${operator} ?`
    } else {
      place += `?? ${operator} ?,`
    }

    values.push(key, value)
  })

  return {
    place,
    values,
  }
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

/**
 * 查找所有数据
 * @param tb  表名
 */
export const findAll = (tb: string) => {
  return db.query(`SELECT * FROM ?? ;`, [tb])
}

/**
 * 根据 id 查找
 * @param tb 表名
 * @param id id
 */
export const findById = (tb: string, id: number | string) => {
  return db.query(`SELECT * FROM ?? where id = ? ;`, [tb, id])
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
  const { place, values } = parserCondition(condition)
  return db.query(`SELECT * FROM ?? WHERE ${place} ;`, [tb, ...values])
}

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

  const sql = `INSERT INTO ?? (${keyPlace}) VALUES (${valuePlace}) ;`

  return db.query(sql, [tb, ...keys, ...values])
}

/**
 * 更新单条数据
 * @param tb 表名
 * @param condition 表的查询条件
 * @param data 值
 * @example
 * update(user,{id:1},{age:20})
 * execute : `UPDATE user SET age = 20 WHERE id = 1;`
 */
export const updateOne = (tb: string, condition: Object, data: Object) => {
  const { place: dataPlace, values: dataValues } = parserData(data)

  const { place: condPlace, values: condValues } = parserCondition(condition)

  const sql = `UPDATE ?? SET ${dataPlace} WHERE ${condPlace};`

  return db.query(sql, [tb, ...dataValues, ...condValues])
}
