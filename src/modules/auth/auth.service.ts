import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto, UpdateUserInfoDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private hashPassword(password: string): string {
    // TODO: Implement proper password hashing with bcrypt
    // For now, using simple hash for demonstration
    return Buffer.from(password).toString('base64');
  }

  private comparePassword(password: string, hash: string): boolean {
    // TODO: Implement proper password comparison with bcrypt
    // For now, using simple comparison
    return Buffer.from(password).toString('base64') === hash;
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user || !this.comparePassword(signInDto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.handle };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const existingHandle = await this.userService.findByHandle(signUpDto.handle);
    if (existingHandle) {
      throw new BadRequestException('Handle already in use');
    }

    const passwordHash = this.hashPassword(signUpDto.password);

    const user = await this.userService.create(
      signUpDto.firstName,
      signUpDto.handle,
      signUpDto.email,
      signUpDto.newsletterSubscribed || false,
      passwordHash,
    );
    if (!user) {
      throw new UnauthorizedException('Failed to create user');
    }

    const payload = { sub: user.id, username: user.handle };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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

    let passwordHash: string | null = null;
    if (updateUserInfoDto.password) {
      passwordHash = this.hashPassword(updateUserInfoDto.password);
    }

    return this.userService.update(
      userId,
      updateUserInfoDto.firstName || null,
      updateUserInfoDto.handle || null,
      updateUserInfoDto.email || null,
      updateUserInfoDto.newsletterSubscribed || null,
      passwordHash,
    );
  }

}
