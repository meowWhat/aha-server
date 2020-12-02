import { Injectable } from '@nestjs/common'
  
@Injectable()
export class UserService {
  private readonly cats = []
  create(cat) {
    this.cats.push(cat)
  }
  findAll() {
    return this.cats
  }
}