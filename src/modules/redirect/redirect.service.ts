import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../../infrastructure/cache/redis/redis.service';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

@Injectable()
export class RedirectService {
  constructor(
    private readonly redisService: RedisService,
    private readonly cassandraLinkRepository: CassandraLinkRepository
  ) {}

  async resolveShortCode(shortCode: string, trackingData: any): Promise<string> {
    const cacheKey = `link:${shortCode}`;
    let originalUrl = await this.redisService.get(cacheKey);

    if (!originalUrl) {
      // Fallback to Cassandra cluster
      originalUrl = await this.cassandraLinkRepository.findByShortCode(shortCode);
      if (!originalUrl) {
        throw new NotFoundException('Linked URL no longer exists or is inactive.');
      }

      // Cache the fetched result in Redis immediately
      await this.redisService.set(cacheKey, originalUrl, 86400);
    }

    // Dispatch analytics events asynchronously
    this.dispatchAnalyticsEvents({
      shortCode,
      referrer: trackingData.referrer || '',
      userAgent: trackingData.userAgent || '',
      ip: trackingData.ip || '',
      eventTime: trackingData.timestamp || new Date(),
    });

    return originalUrl;
  }

  private dispatchAnalyticsEvents(click: any) {
    this.cassandraLinkRepository.insertClick(click);
  }

}
