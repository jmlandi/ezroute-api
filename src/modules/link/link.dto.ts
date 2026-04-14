import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsObject, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
  @ApiProperty({
    example: 'workspace-123',
    description: 'Workspace ID where the link belongs',
  })
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @ApiProperty({
    example: 'https://example.com/very/long/url',
    description: 'Original long URL to shorten',
  })
  @IsNotEmpty()
  @IsUrl()
  originalUrl!: string;

  @ApiProperty({
    example: { utm_source: 'twitter', utm_campaign: 'promo' },
    description: 'Search parameters to add to the URL',
    required: false,
  })
  @IsOptional()
  @IsObject()
  searchParams?: Record<string, string>;

  @ApiProperty({
    example: true,
    description: 'Whether the link is active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLinkDto {
  @ApiProperty({
    example: false,
    description: 'Link active status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: { utm_source: 'twitter' },
    description: 'Search parameters',
    required: false,
  })
  @IsOptional()
  @IsObject()
  searchParams?: Record<string, string>;
}
