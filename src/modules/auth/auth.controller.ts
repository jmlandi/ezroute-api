import { Controller, HttpCode, HttpStatus, Body, Request, Post, Get, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SignInDto, SignUpDto, UpdateUserInfoDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully, returns access token' })
  @ApiResponse({ status: 400, description: 'Invalid input or user already exists' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getUserInfo(@Request() request: any) {
    return this.authService.getUserInfo(request);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('me')
  async updateUserInfo(@Request() request: any, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    const userId = request.user?.sub;
    return this.authService.updateUserInfo(userId, updateUserInfoDto);
  }

}
