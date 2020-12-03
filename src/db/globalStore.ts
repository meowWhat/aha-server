import { Store } from 'src/helper/store'

/**
 * 储存session信息
 *  @key : session.id
 * @value : userid
 */
const sessionStore = new Store()

/**
 * 储存验证码密码
 *  @key : ip地址
 *  @value : text密码
 */
const captchaStore = new Store()

/**
 * 储存用户添加状态
 * @key: 用户id + 好友id;
 * @value : { userid : false , friend_id : false }
 */
const userAdderStore = new Store()

export { sessionStore, captchaStore, userAdderStore }
