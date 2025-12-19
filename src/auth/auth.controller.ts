import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserDto } from 'src/user/dto/userdto';
import { AuthService } from './auth.service';
//import { AuthGuard } from './auth.guard';
import { JwtPayload } from './constants';
import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() UserDto: UserDto) {
    const { username, password } = UserDto;
    return await this.authService.signIn(username, password);
  }

  //@UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req: Request & { user: JwtPayload }) {
    return req['user'];
  }
}
