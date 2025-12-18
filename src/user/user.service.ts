import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { UserDto } from './dto/userdto';

@Injectable()
export class UserService {
  /**
   * UserService 构造函数
   * @param userModel - 注入的 Mongoose User 模型实例，用于与数据库交互
   *                    使用 @InjectModel(User.name) 装饰器获取 User 模型
   *                    private readonly 修饰符确保该属性只能在类内部访问且不可修改
   */
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(userDto: UserDto) {
    const user = new this.userModel(userDto);
    return await user.save();
  }
  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
}
