import { Controller, Get, Param, Res, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RedirectService } from './redirect.service';
import type { Response, Request } from 'express';

@ApiTags('Redirect')
@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @ApiOperation({ summary: 'Redirect to original URL by short code' })
  @ApiParam({ name: 'shortCode', description: 'Short code of the link' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiResponse({ status: 404, description: 'Short code not found' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const trackingData = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'],
      timestamp: new Date(),
    };

    const originalUrl = await this.redirectService.resolveShortCode(shortCode, trackingData);
    console.log(`Redirecting short code ${shortCode} to ${originalUrl}`);
    return res.redirect(302, originalUrl);
  }

}
