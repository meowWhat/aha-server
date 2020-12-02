import { Module } from '@nestjs/common'
import { LoginController } from './Login.controller'

@Module({
  controllers: [LoginController],
})
export class LoginModule {}
