import {
  Body,
  CacheInterceptor,
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { LoginDto } from './dto/login.dto';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guard/local-authentication.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('/login')
  async login(
    @GetUser() user: User,
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    const accessCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const refreshCookie = await this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );
    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    const data = await this.authService.validate(
      loginDto.email,
      loginDto.password,
    );
    return res.json(data);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/profile')
  async getProfile(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@GetUser() user: User, @Res() res: Response) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );

    res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }
}
