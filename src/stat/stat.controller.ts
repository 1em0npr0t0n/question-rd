import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';
import { AnswerService } from 'src/answer/answer.service';
@Controller('stat')
export class StatController {
  constructor(
    private readonly statService: StatService,
    private readonly answerService: AnswerService,
  ) {}

  //   @Post()
  //   create(@Body() createStatDto: CreateStatDto) {
  //     return this.statService.create(createStatDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.statService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.statService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateStatDto: UpdateStatDto) {
  //     return this.statService.update(+id, updateStatDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.statService.remove(+id);
  //   }
  // }
  @Get(':questionId')
  async findAllList(
    @Param('questionId') questionId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const noData = { list: [], total: 0 };
    if (!questionId) {
      return noData;
    }
    const { list, total } = await this.answerService.findAllList(
      questionId,
      parseInt(page),
      parseInt(pageSize),
    );
    if (!list || list.length === 0) {
      return noData;
    }
    const statComponentDtoList =
      await this.statService.AnswerListToStatComponent(list, questionId);
    if (
      !statComponentDtoList ||
      statComponentDtoList.list.length !== list.length
    ) {
      return noData;
    }
    return {
      list: statComponentDtoList.list,
      total,
    };
  }
  @Get(':questionId/:componentId')
  async findComponentValues(
    @Param('questionId') questionId: string,
    @Param('componentId') componentId: string,
  ) {
    const stat = await this.statService.findComponentValues(
      questionId,
      componentId,
    );
    //console.log('i', stat);
    return { stat };
  }
}
