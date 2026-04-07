import { Controller, Post, Body, Req } from '@nestjs/common';
import { LinkService } from './link.service';

@Controller('api/links')
export class LinkController {
  constructor(private readonly linkService: LinkService) { }

  /**
   * Endpoint for generating new shortened links.
   */
  @Post()
  async createLink(@Body() body: any, @Req() req: any): Promise<any> {
    const { userId, workspaceId, originalUrl, searchParams = {}, isActive = true } = body;
    return this.linkService.createLink(userId, workspaceId, originalUrl, searchParams, isActive);
  }
}
