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
}
