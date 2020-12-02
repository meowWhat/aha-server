import { Module } from '@nestjs/common'
import { RegisterController } from './Register.controller'

@Module({
  controllers: [RegisterController],
})
export class RegisterModule {}
