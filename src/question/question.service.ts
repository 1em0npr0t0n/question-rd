import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Model } from 'mongoose';
import { QuestionDto } from './dto/question.dto';
import { JwtPayload } from 'src/auth/constants';
import { nanoid } from 'nanoid';
import { isValidObjectId } from 'src/utlis/mongoDB';
import { formatTimestamp } from 'src/utlis/formatTime';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async create(user: JwtPayload) {
    const question = new this.questionModel({
      title: '新问卷' + formatTimestamp(Date.now(), 'HH:mm'),
      desc: '简介',
      authorId: user._id,
      author: user.username,
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionTitle',
          title: '标题',
          isHidden: false,
          isLock: false,
          props: { text: '标题', level: 1, isCenter: true },
        },
      ],
    });
    return await question.save();
  }
  async findOne(id: string) {
    isValidObjectId(id);
    return await this.questionModel.findOne({ _id: id });
  }
  // 物理删除
  async physicalDelete(id: string, authorId: string) {
    const res = await this.questionModel.findOneAndDelete({
      _id: id,
      authorId,
    });
    return res;
  }
  // 逻辑删除
  async delete(id: string, authorId: string) {
    isValidObjectId(id); //检查id是否为有效的 ObjectId 格式
    return await this.questionModel.updateOne(
      { _id: authorId },
      { isDeleted: true },
    );
  }

  // 物理删除多个
  async physicalDeleteMany(ids: string[], authorId: string) {
    return await this.questionModel.deleteMany({ _id: { $in: ids }, authorId });
  }

  // 更新
  async update(id: string, questionDto: QuestionDto, authorId: string) {
    isValidObjectId(id); //检查id是否为有效的 ObjectId 格式
    return await this.questionModel.updateOne(
      { _id: id, authorId },
      questionDto,
    );
  }
  // 分页查询
  async findAllList({
    keyword = '',
    page = 1,
    pageSize = 10,
    authorId = '',
    isStar = false,
    isDeleted = false,
  }) {
    // 构建查询条件 基础条件是作者和是否删除
    const whereOpt: {
      authorId: string;
      isDeleted: boolean;
      title?: { $regex: RegExp };
      isStar?: boolean;
    } = { authorId, isDeleted };

    //只有为isStar真才拼接条件
    if (isStar) {
      console.log('isStar is true', isStar);
      whereOpt.isStar = isStar;
    }

    //只有keyword有值才拼接条件
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
  //复制问卷
  async duplicate(id: string, authorId: string) {
    // 验证 id 是否为有效的 ObjectId 格式
    isValidObjectId(id);
    const question = await this.questionModel.findOne({ _id: id, authorId });
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.BAD_REQUEST);
    }
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: undefined,
      title: question.title + '副本',
      isDeleted: false,
      isPublished: false,
      isStar: false,
      // 复制组件列表
      componentList: (question.componentList || []).map((component) => ({
        ...component,
        fe_id: nanoid(), // 新组件的fe_id
        isHidden: false,
        isLock: false,
      })),
    });
    return await newQuestion.save();
  }
}
