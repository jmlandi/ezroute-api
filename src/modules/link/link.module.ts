import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { PostgresLinkRepository } from '../../infrastructure/database/postgres/postgres.link.repository';
import { CassandraLinkRepository } from '../../infrastructure/database/cassandra/cassandra.link.repository';

@Module({
  controllers: [LinkController],
  providers: [
    LinkService,
    PostgresLinkRepository,
    CassandraLinkRepository,
  ],
})
export class LinkModule {}
