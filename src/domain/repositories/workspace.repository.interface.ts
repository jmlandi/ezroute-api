import { Workspace } from '../types/workspace.type';

export interface IWorkspaceRepository {

  findById(id: string): Promise<Workspace | undefined>;

  findByOwnerId(ownerId: string): Promise<Workspace[] | undefined>;

  create(
    ownerId: string,
    name: string,
  ): Promise<Workspace | undefined>;

  update(
    id: string,
    name: string | null,
    status: 'active' | 'suspended' | 'deactivated' | null,
  ): Promise<Workspace | undefined>;

  delete(id: string): Promise<{ affectedRows: number }>;

}
