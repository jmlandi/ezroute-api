import { IsString, IsEmail, IsOptional, IsUrl, IsNotEmpty, MinLength, MaxLength, IsBoolean } from 'class-validator';


export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;
  
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  handle!: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
  
  @IsOptional()
  @IsBoolean()
  newsletterSubscribed?: boolean;
  
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;
}

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;
  
  @IsOptional()
  @IsEmail()
  email?: string;
  
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  handle?: string;
  
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
  
  @IsOptional()
  @IsBoolean()
  newsletterSubscribed?: boolean;
  
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;
}
