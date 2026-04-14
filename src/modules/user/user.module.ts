import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PostgresUserRepository } from '../../infrastructure/database/postgres/postgres.user.repository';
import { PostgresModule } from '../../infrastructure/database/postgres/postgres.module';


@Module({
  imports: [PostgresModule],
  providers: [PostgresUserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
