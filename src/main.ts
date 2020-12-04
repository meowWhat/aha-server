import 'colors'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { db } from './db/driver'
import * as rateLimit from 'express-rate-limit'
import * as session from 'express-session'
import * as FileStore from 'session-file-store'
import * as cors from 'cors'

const FS = FileStore(session)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = 3000
  // ip 请求次数限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  )
  // 跨域
  app.use(cors())
  // session 中间件
  app.use(
    session({
      secret: 'ddd@fa',
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 15 },
      resave: false,
      saveUninitialized: false,
      store: new FS({
        ttl: 1000 * 60 * 60 * 24 * 15,
        retries: 2,
      }),
    }),
  )
  db.connect()

  try {
    await app.listen(port)
    console.log(`服务器启动成功,监听于端口${port}`.green)
  } catch (error) {
    console.log(`服务器启动失败,错误信息[ ${error} ]`.red)
  }
}

bootstrap()
