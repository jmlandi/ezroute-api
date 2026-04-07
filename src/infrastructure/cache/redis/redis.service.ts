import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  onModuleDestroy() {
    this.redis.quit();
  }

  /**
   * Atomic counter used to generate unique numeric IDs.
   * This ID is then converted to Base62 for short codes.
   */
  async incrementLinkId(): Promise<number> {
    return this.redis.incr('global:link:counter');
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.redis.set(key, value, 'EX', ttlSeconds);
    }
    return this.redis.set(key, value);
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
