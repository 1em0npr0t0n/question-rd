import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop()
  jsCode: string;

  @Prop()
  cssCode: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  authorId: string;

  @Prop({ default: [] })
  componentList: {
    fe_id: string; //来自前端的组件ID
    type: string; //组件类型
    title: string; //组件标题
    isHidden: boolean; //是否隐藏
    isLock: boolean; //是否锁定组件
    props: object; //组件属性
  }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
