import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { RedisService } from '../../infrastructure/cache/redis/redis.service';
import { AmplitudeService } from '../../infrastructure/external/analytics/amplitude.service';
import { CassandraService } from '../../infrastructure/database/cassandra/cassandra.service';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

@Module({
  controllers: [RedirectController],
  providers: [RedirectService, RedisService, AmplitudeService, CassandraService, CassandraLinkRepository],
})
export class RedirectModule { }
