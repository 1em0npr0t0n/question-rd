import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/userdto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post('register')
  async register(@Body() userDto: UserDto) {
    try {
      return await this.userService.create(userDto);
    } catch (err: unknown) {
      // 使用 unknown 类型替代 any
      // 使用类型守卫确保 err 是 Error 类型
      if (err instanceof Error) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
      // 如果不是 Error 类型，使用默认错误消息
      throw new HttpException('注册失败，请稍后重试', HttpStatus.BAD_REQUEST);
    }
  }
  @Public()
  @Get('info')
  @Redirect('/api/auth/profile', 302)
  info() {
    return;
  }
  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307)
  login() {
    return;
  }
}
