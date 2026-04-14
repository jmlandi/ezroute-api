import { Controller, HttpCode, HttpStatus, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateLinkDto } from './link.dto';
import { AuthGuard } from '../auth/auth.guard';
import { LinkService } from './link.service';

@ApiTags('Link')
@Controller('api/links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new shortened link' })
  @ApiResponse({ status: 201, description: 'Link created successfully with short code' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createLink(@Request() request: any, @Body() createLinkDto: CreateLinkDto) {
    const userId = request.user?.sub;
    return this.linkService.createLink(
      userId,
      createLinkDto.workspaceId,
      createLinkDto.originalUrl,
      createLinkDto.searchParams || {},
      createLinkDto.isActive !== false,
    );
  }

}
