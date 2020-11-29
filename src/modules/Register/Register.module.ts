import { Module } from '@nestjs/common'
import { RegisterController } from './Register.controller'
import { RegisterService } from './Register.service'

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
