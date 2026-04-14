import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto, UpdateUserInfoDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user || user.password !== signInDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.handle };
    return { 
      access_token: await this.jwtService.signAsync(payload)
    } 
  }

  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const user = await this.userService.create(
      signUpDto.firstName,
      signUpDto.handle,
      signUpDto.email,
      signUpDto.newsletterSubscribed || false,
      signUpDto.password,
    ); 
    if (!user) {
      throw new UnauthorizedException('Failed to create user');
    }

    const payload = { sub: user.id, username: user.handle };
    return { 
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  async getUserInfo(request: any) {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not found in token');
    }
    return this.userService.findById(userId);
  }

  async updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto) {
    if (!userId) {
      throw new UnauthorizedException('User not found in token');
    }

    return this.userService.update(
      userId,
      updateUserInfoDto.firstName || null,
      updateUserInfoDto.handle || null,
      updateUserInfoDto.email || null,
      updateUserInfoDto.newsletterSubscribed || null,
      updateUserInfoDto.password || null,
    );
  }

}
