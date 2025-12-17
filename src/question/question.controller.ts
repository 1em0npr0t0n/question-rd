import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
  @Get('test')
  getTest(): string {
    throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
  }
  @Get()
  findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return { keyword: keyword, page: page, pageSize: pageSize };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, title: 'f' };
  }
  @Patch(':id')
  UpdateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    //body
    console.log('questionDto', questionDto);
    return { id };
  }
}
