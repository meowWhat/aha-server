import 'colors'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { db } from './db/driver'
import * as rateLimit from 'express-rate-limit'
import * as session from 'express-session'
import * as cors from 'cors'
import { sessionTimeOut } from './consts'
import * as fs from 'fs'

async function bootstrap() {
  const isProd = process.argv[2] === '--prod'

  const app = await NestFactory.create(AppModule, isProd ? {
    httpsOptions: {
      key: fs.readFileSync('./cert/server.key'),
      cert: fs.readFileSync('./cert/server.pem')
    }
  } : undefined
  )

  const port = 30001

  // ip 请求次数限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  )
  // 跨域
  app.use(
    cors({
      origin: isProd ? 'https://www.jiahao.site' : 'http://localhost:3000',
      optionsSuccessStatus: 200,
      credentials: true,
    }),
  )
  // session 中间件
  app.use(
    session({
      secret: 'ddd@fa',
      cookie: { maxAge: sessionTimeOut },
      resave: false,
      saveUninitialized: false,
    }),
  )

  db.connect()
  // mq.connect()

  try {
    await app.listen(port)
    console.log(`服务器启动成功,监听于端口${port}`.green)
  } catch (error) {
    console.log(`服务器启动失败,错误信息[ ${error} ]`.red)
  }
}

bootstrap()
