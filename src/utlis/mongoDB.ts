import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const isValidObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new HttpException('问卷不存在', HttpStatus.BAD_REQUEST);
  }
};
