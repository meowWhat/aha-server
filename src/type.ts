import { Session } from 'express-session'

export interface MySession extends Session {
  userKey: string
  captcha: string
}
