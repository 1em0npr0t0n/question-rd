import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
