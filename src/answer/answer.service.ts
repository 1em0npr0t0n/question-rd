import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Answer, AnswerDocument } from './schemas/answer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,
  ) {}
  async create(body: Answer) {
    if (body.questionId == null) {
      throw new HttpException('缺少问卷', HttpStatus.BAD_REQUEST);
    }
    return this.answerModel.create(body);
  }

  async count(questionId: string) {
    return this.answerModel.countDocuments({ question: questionId }).exec();
  }

  async findAllList(questionId: string, page: number, pageSize: number) {
    const [list, total] = await Promise.all([
      this.answerModel
        .find({ questionId: questionId })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.answerModel.countDocuments({ questionId: questionId }).exec(),
    ]);
    return {
      list,
      total,
    };
  }
  async findQuestionComponentStat(questionId: string, componentId: string) {
    return this.answerModel
      .find({ questionId: questionId, componentId: componentId })
      .exec();
  }
  async findComponentValues(
    questionId: string,
    componentId: string,
  ): Promise<string[]> {
    //简单定义一个结果接口 防止any
    interface AggregationResult {
      _id: string;
      values: string[];
    }
    const results = (await this.answerModel
      .aggregate([
        // 阶段1：匹配顶层的questionId
        {
          $match: {
            questionId: questionId,
          },
        },
        // 阶段2：展开answerList数组
        {
          $unwind: '$answerList',
        },
        // 阶段3：匹配数组中特定的componentId
        {
          $match: {
            'answerList.componentId': componentId,
          },
        },
        // 阶段4：将所有匹配的value分组到一个数组中
        {
          $group: {
            _id: questionId, // 不按特定字段分组，将所有结果合并为一组
            values: { $push: '$answerList.value' }, // 使用$push收集所有值。如需去重，可改用 $addToSet
          },
        },
      ])
      .exec()) as AggregationResult[];
    //console.log(results);
    // 如果找到匹配项，返回values数组；否则返回空数组
    //results[0].values as string[];

    return results.length > 0 ? results[0].values : [];
  }
}
