import { IsString, IsNotEmpty, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: 'My Workspace',
    description: 'Workspace name',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;
}

export class UpdateWorkspaceDto {
  @ApiProperty({
    example: 'Updated Workspace',
    description: 'New workspace name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    example: 'active',
    description: 'Workspace status',
    enum: ['active', 'suspended', 'deactivated'],
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'suspended', 'deactivated'])
  status?: 'active' | 'suspended' | 'deactivated';
}
