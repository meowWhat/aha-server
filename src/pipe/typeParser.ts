import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class ParseBoolenPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (typeof value === 'boolean') {
      return value
    }
    if (value === 'true') {
      return true
    }
    if (value === 'false') {
      return false
    }

    return undefined
  }
}
