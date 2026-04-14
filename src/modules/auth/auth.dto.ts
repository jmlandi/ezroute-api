import { IsString, IsEmail, IsOptional, IsUrl, IsNotEmpty, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'User password (minimum 8 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class SignUpDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username handle (3-50 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  handle!: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password (minimum 8 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: true,
    description: 'Newsletter subscription preference',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  newsletterSubscribed?: boolean;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;
}

export class UpdateUserInfoDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username handle',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  handle?: string;

  @ApiProperty({
    example: 'NewPassword123',
    description: 'New password',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    example: true,
    description: 'Newsletter subscription preference',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  newsletterSubscribed?: boolean;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;
}
