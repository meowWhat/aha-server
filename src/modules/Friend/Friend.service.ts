import { Injectable } from '@nestjs/common'
  
@Injectable()
export class FriendService {
  private readonly cats = []
  create(cat) {
    this.cats.push(cat)
  }
  findAll() {
    return this.cats
  }
}