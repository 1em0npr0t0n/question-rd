import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionSerive: QuestionService) {}
  @Get('test')
  getTest(): string {
    throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
  }

  @Post()
  create() {
    return this.questionSerive.create();
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
    return this.questionSerive.findOne(id);
  }
  @Patch(':id')
  UpdateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    //body
    console.log('questionDto', questionDto);
    return { id };
  }
}
