import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/cache/redis/redis.service';
import { PostgresLinkRepository } from '../../infrastructure/database/postgres/postgres.link.repository';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';
import { createLink } from '../../domain/types/link.types';

const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class LinkService {
  constructor(
    private readonly redisService: RedisService,
    private readonly postgresLinkRepo: PostgresLinkRepository,
    private readonly cassandraLinkRepo: CassandraLinkRepository
  ) { }

  /**
   * Encodes a numeric ID to a Base62 string.
   */
  private encodeBase62(num: number): string {
    if (num === 0) return BASE62_CHARSET[0];
    let str = '';
    while (num > 0) {
      str = BASE62_CHARSET[num % 62] + str;
      num = Math.floor(num / 62);
    }
    return str;
  }

  /**
   * Link Creation Flow (Writes to Postgres + Cassandra)
   */
  async createLink(userId: string, workspaceId: string, originalUrl: string, searchParams: Record<string, string> = {}, isActive: boolean = true): Promise<any> {
    // Generate unique incrementing ID directly from Redis
    const id = await this.redisService.incrementLinkId();

    // Convert to Base62 shortcode without hitting the relational DB
    const shortCode = this.encodeBase62(id);

    // Create link object
    const link: createLink = {
      shortCode,
      originalUrl: originalUrl.toString(),
      workspaceId: workspaceId.toString(),
      userId: userId.toString(),
      searchParams,
      createdAt: new Date(),
      isActive
    }

    console.log(link);

    // Persist to Postgres (Core Business Source of truth / Metadata)
    await this.postgresLinkRepo.create(link);

    // Persist to Cassandra (High-throughput read optimized scale resolution)
    await this.cassandraLinkRepo.create(link);

    return { link };
  }
}
