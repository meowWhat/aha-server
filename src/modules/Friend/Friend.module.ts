import { Module } from '@nestjs/common'
import { FriendController } from './Friend.controller'
import { FriendService } from './Friend.service'

@Module({
  controllers: [FriendController],
  providers: [FriendService],
})

export class FriendModule {}