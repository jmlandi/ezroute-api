import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import type { Response, Request } from 'express';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) { }

  /**
   * Root wildcard path handler. Must be lightweight and isolated.
   */
  @Get(':shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // Extract non-identifying tracking metrics
    const trackingData = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'],
      timestamp: new Date()
    };

    const originalUrl = await this.redirectService.resolveShortCode(shortCode, trackingData);

    // Optimal return HTTP 302, could be changed depending on long-term permanence required
    return res.redirect(302, originalUrl);
  }
}
