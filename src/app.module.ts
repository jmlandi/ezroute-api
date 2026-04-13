import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infrastructure/cache/redis/redis.module';
import { PostgresModule } from './infrastructure/database/postgres/postgres.module';
import { CassandraModule } from './infrastructure/database/cassandra/cassandra.module';
import { LinkModule } from './modules/link/link.module';
import { RedirectModule } from './modules/redirect/redirect.module';

@Module({
  imports: [
    ConfigModule.forRoot( { isGlobal: true } ),
    RedisModule,
    PostgresModule,
    CassandraModule,
    LinkModule,
    RedirectModule
  ],
})
export class AppModule {}
