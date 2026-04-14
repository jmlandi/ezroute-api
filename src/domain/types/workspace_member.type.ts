import { Workspace } from './workspace.type';
import { User } from './user.type';

export interface WorkspaceMember {
  id:        string;
  user:      User;
  workspace: Workspace;
  role:      'owner' | 'admin' | 'member';
  createdAt: Date;
}
