import { Controller, HttpCode, HttpStatus, Body, Request, Post, Get, Put, UseGuards } from '@nestjs/common';
import { SignInDto, SignUpDto, UpdateUserInfoDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getUserInfo(@Request() request: any) {
    return this.authService.getUserInfo(request);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('me')
  async updateUserInfo(@Request() request: any, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    const userId = request.user?.sub;
    return this.authService.updateUserInfo(userId, updateUserInfoDto);
  }

}
