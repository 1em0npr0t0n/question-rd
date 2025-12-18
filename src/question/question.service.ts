import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Model } from 'mongoose';
import { QuestionDto } from './dto/question.dto';

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
  async delete(id: string) {
    return await this.questionModel.findByIdAndDelete(id);
  }

  async update(id: string, questionDto: QuestionDto) {
    return await this.questionModel.updateOne({ _id: id }, questionDto);
  }

  async findAllList({ keyword = '', page = 1, pageSize = 10 }) {
    const whereOpt: { title?: { $regex: RegExp } } = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg };
    }
    const [list, total] = await Promise.all([
      this.questionModel
        .find(whereOpt)
        .sort({ _id: -1 }) //find后排序，-1表示降序
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      this.questionModel.countDocuments(whereOpt),
    ]);
    return { list, total };
  }
}
