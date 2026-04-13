import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { AmplitudeService } from '../../infrastructure/external/analytics/amplitude.service';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

@Module({
  controllers: [RedirectController],
  providers: [
    RedirectService,
    AmplitudeService,
    CassandraLinkRepository
  ],
})
export class RedirectModule { }
