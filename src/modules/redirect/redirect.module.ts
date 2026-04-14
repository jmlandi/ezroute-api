import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

@Module({
  controllers: [RedirectController],
  providers: [
    RedirectService,
    CassandraLinkRepository,
  ],
})
export class RedirectModule {}
