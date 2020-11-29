import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createCatDto) {
    return 'This action adds a new cat'
  }

  @Get()
  findAll(@Query() query) {
    // return `This action returns all cats (limit: ${query.limit} items)`
    throw new BadRequestException()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, code: 200 }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto) {
    return `This action updates a #${id} cat`
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`
  }
}
