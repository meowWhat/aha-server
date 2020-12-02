import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class ParseBoolenPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    // return new
    if (value === 'true') {
      return true
    }
    if (value === 'false') {
      return false
    }
    return undefined
  }
}
