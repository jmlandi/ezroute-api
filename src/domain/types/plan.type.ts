export interface Plan {
  tier:                   string;
  price:                  number;
  maxWorkspaces:          number;
  maxMembersPerWorkspace: number;
  maxLinksPerWorkspace:   number;
}
