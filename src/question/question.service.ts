import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async create() {
    const question = new this.questionModel({
      title: 'titile' + Date.now(),
      desc: 'desc',
    });
    return await question.save();
  }
  async findOne(id: string) {
    return await this.questionModel.findById(id);
    //return await this.questionModel.findById(id);
  }
}
