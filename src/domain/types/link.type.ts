import { User } from './user.type'; 
import { Workspace } from './workspace.type';

export interface Link {
    id:           string;
    workspace:    Workspace;
    user:         User;
    shortCode:    string;
    originalUrl:  string;
    searchParams: Record<string, string>;
    isActive:     boolean;
    createdAt:    Date;
}
