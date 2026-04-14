import { Injectable } from '@nestjs/common';
import { PostgresWorkspaceRepository } from '../../infrastructure/database/postgres/postgres.workspace.repository';
import { Workspace } from '../../domain/types/workspace.type';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: PostgresWorkspaceRepository) {}

  async findById(id: string): Promise<Workspace | undefined> {
    return this.workspaceRepository.findById(id);
  }

  async findByOwnerId(ownerId: string): Promise<Workspace[] | undefined> {
    return this.workspaceRepository.findByOwnerId(ownerId);
  }

  async create(
    ownerId: string,
    name: string,
  ): Promise<Workspace | undefined> {
    return this.workspaceRepository.create(ownerId, name);
  }

  async update(
    id: string,
    name: string | null,
    status: 'active' | 'suspended' | 'deactivated' | null,
  ): Promise<Workspace | undefined> {
    return this.workspaceRepository.update(id, name, status);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.workspaceRepository.delete(id);
    return result.affectedRows > 0;
  }

}
