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
import { Public } from 'src/auth/decorators/public.decorator';

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
    //console.log(req);
    //const { username } = req['user'];
    return this.questionService.create(req.user);
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('isStar') isStar: boolean,
    @Query('isDeleted') isDeleted: boolean = false,
    @Request() req: Request & { user: JwtPayload },
  ) {
    const { _id: authorId } = req.user;
    const { list, total } = await this.questionService.findAllList({
      keyword: keyword,
      page: Number(page),
      pageSize: Number(pageSize),
      authorId,
      isStar,
      isDeleted,
    });
    return { list, count: total };
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }
  @Patch(':id') //改
  UpdateOne(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    const { _id: authorId } = req.user;
    return this.questionService.update(id, questionDto, authorId);
  }
  @Delete(':id') //删
  deleteOne(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    const { _id: authorId } = req.user;
    return this.questionService.delete(id, authorId);
  }
  @Delete('') //多删
  deleteMany(
    @Body() questionDto: QuestionDto,
    @Request() req: Request & { user: JwtPayload },
  ) {
    const { _id: authorId } = req.user;
    const { ids } = questionDto;
    return this.questionService.physicalDeleteMany(ids, authorId);
  }
  /**
   * 复制问卷
   * @param id 问卷ID
   * @param req 请求对象，包含用户信息
   * @returns 复制后的问卷
   */
  @Post('duplicate/:id')
  duplicate(
    @Param('id') id: string,
    @Request() req: Request & { user: JwtPayload },
  ) {
    const { _id: authorId } = req.user;
    return this.questionService.duplicate(id, authorId);
  }
}
