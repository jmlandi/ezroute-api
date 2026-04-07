import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { RedisService } from '../../infrastructure/cache/redis/redis.service';
import { PostgresLinkRepository } from '../../infrastructure/database/postgres/postgres.link.repository';
import { CassandraService } from '../../infrastructure/database/cassandra/cassandra.service';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

@Module({
  controllers: [LinkController],
  providers: [
    LinkService,
    RedisService,
    PostgresLinkRepository,
    CassandraService,
    CassandraLinkRepository
  ],
})
export class LinkModule { }
