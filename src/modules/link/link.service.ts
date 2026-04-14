import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/cache/redis/redis.service';
import { PostgresLinkRepository } from '../../infrastructure/database/postgres/postgres.link.repository';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class LinkService {
  constructor(
    private readonly redisService: RedisService,
    private readonly postgresLinkRepository: PostgresLinkRepository,
    private readonly cassandraLinkRepository: CassandraLinkRepository
  ) {}

  private encodeBase62(num: number): string {
    if (num === 0) return BASE62_CHARSET[0];
    let str = '';
    while (num > 0) {
      str = BASE62_CHARSET[num % 62] + str;
      num = Math.floor(num / 62);
    }
    return str;
  }

  async createLink(
    userId: string,
    workspaceId: string,
    originalUrl: string,
    searchParams: Record<string, string> = {},
    isActive: boolean = true
  ): Promise<any> {
    // Generate unique ID from Redis
    const id = await this.redisService.incrementLinkId();

    // Convert to Base62 shortcode
    const shortCode = this.encodeBase62(id);

    // Create link object
    const link = {
      shortCode,
      originalUrl: originalUrl.toString(),
      workspaceId: workspaceId.toString(),
      userId: userId.toString(),
      searchParams,
      createdAt: new Date(),
      isActive,
    };

    // Persist to Postgres (metadata storage)
    await this.postgresLinkRepository.create(link);

    // Persist to Cassandra (high-throughput read-optimized)
    await this.cassandraLinkRepository.create(link);

    return { link };
  }

}
