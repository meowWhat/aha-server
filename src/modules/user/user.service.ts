import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  hello(): string {
    return 'hello user service sss'
  }
}
