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
  Delete,
  Request,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { JwtPayload } from 'src/auth/constants';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get('test')
  getTest(): string {
    throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
  }

  @Post() //增
  create(@Request() req: Request & { user: JwtPayload }) {
    //const { result } = req as JwtPayload;
    console.log(req['user']);
    return this.questionService.create();
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const { list, total } = await this.questionService.findAllList({
      keyword: keyword,
      page: Number(page),
      pageSize: Number(pageSize),
    });
    return { list, count: total };
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }
  @Patch(':id') //改
  UpdateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    return this.questionService.update(id, questionDto);
  }
  @Delete(':id') //删
  deleteOne(@Param('id') id: string) {
    return this.questionService.delete(id);
  }
}
