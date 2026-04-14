import { User } from './user.type';
import { Link } from './link.type';

export interface Workspace {
  id:         string,
  owner:      User,
  name:       string,
  links:      Link[],
  status:     'active' | 'suspended' | 'deactivated',
  createdAt:  Date,
  updatedAt:  Date,
}
