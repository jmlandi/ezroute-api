import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { PostgresWorkspaceRepository } from '../../infrastructure/database/postgres/postgres.workspace.repository';
import { PostgresModule } from '../../infrastructure/database/postgres/postgres.module';

@Module({
  imports: [PostgresModule],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    PostgresWorkspaceRepository,
  ],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
