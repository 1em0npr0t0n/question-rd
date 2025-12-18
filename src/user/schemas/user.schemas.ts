import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // 启用自动生成 createdAt 和 updatedAt 字段
export class User {
  @Prop({ required: true, unique: true }) // 用户名必填且唯一
  username: string;

  @Prop({ required: true }) // 密码必填
  password: string;

  @Prop({ required: true, unique: true }) // 邮箱必填且唯一
  email: string;

  @Prop({ required: true, unique: true }) // 电话必填且唯一
  phone: string;

  @Prop({ default: '' }) //昵称
  nickname: string;

  @Prop({ default: 'user' }) // 用户角色，默认为普通用户
  role: string;

  @Prop({ default: true }) // 账户状态，默认为启用
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
