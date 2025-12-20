import { Injectable } from '@nestjs/common';
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
}
