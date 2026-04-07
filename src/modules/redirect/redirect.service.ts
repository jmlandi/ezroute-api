import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../../infrastructure/cache/redis/redis.service';
import { AmplitudeService } from '../../infrastructure/external/analytics/amplitude.service';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';
import { insertClick } from '../../domain/types/link.types';

@Injectable()
export class RedirectService {
  constructor(
    private readonly redisService: RedisService,
    // private readonly amplitudeService: AmplitudeService,
    private readonly cassandraLinkRepository: CassandraLinkRepository
  ) { }

  /**
   * Core high-throughput lightweight resolver.
   */
  async resolveShortCode(shortCode: string, trackingData: any): Promise<string> {
    const cacheKey = `link:${shortCode}`;

    // Very fast look-up in Redis cache
    let originalUrl = await this.redisService.get(cacheKey);

    // Cache miss -> Fallback to robust Cassandra cluster
    if (!originalUrl) {
      // originalUrl = await this.cassandraLinkRepo.findOriginalUrl(shortCode);
      if (!originalUrl) {
        throw new NotFoundException('Linked URL no longer exists or is inactive.');
      }

      // Cache the fetched result in Redis immediately
      await this.redisService.set(cacheKey, originalUrl, 86400); // Cache TTL strategy
    }

    // Fire-and-forget Analytics to prevent rendering delay
    this.dispatchAnalyticsEvents({
      shortCode,
      referrer: trackingData.referrer || '',
      userAgent: trackingData.userAgent || '',
      ip: trackingData.ip || '',
      eventTime: new Date(),
    });

    return originalUrl;
  }

  /**
   * Emits un-blocking tracking events, completely isolated from user wait time.
   */
  private dispatchAnalyticsEvents(click: insertClick) {
    this.cassandraLinkRepository.insertClick(click);
  }
}
