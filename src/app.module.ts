import { Module } from '@nestjs/common'
import { RegisterModule } from './modules/Register/Register.module'

@Module({
  imports: [RegisterModule],
})
export class AppModule {}
