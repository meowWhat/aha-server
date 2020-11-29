import 'colors'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { db } from './db/driver'
import * as rateLimit from 'express-rate-limit'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = 3000
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 40, // limit each IP to 100 requests per windowMs
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
