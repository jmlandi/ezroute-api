import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/environment.config';
import { RedisModule } from './infrastructure/cache/redis/redis.module';
import { PostgresModule } from './infrastructure/database/postgres/postgres.module';
import { CassandraModule } from './infrastructure/database/cassandra/cassandra.module';
import { LinkModule } from './modules/link/link.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      validate,
      envFilePath: ['.env.local', '.env'],
    }),
    RedisModule,
    PostgresModule,
    CassandraModule,
    UserModule,
    LinkModule,
    RedirectModule,
    AuthModule,
    WorkspaceModule
  ],
})
export class AppModule {}
