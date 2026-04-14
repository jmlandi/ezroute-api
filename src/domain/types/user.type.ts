import { Plan } from './plan.type';

export interface User {
  id:                   string;
  firstName:            string;
  handle:               string;
  email:                string;
  password:             string;
  plan:                 Plan;
  newsletterSubscribed: boolean;
  profilePictureUrl:    string | undefined;
  is_deleted:           boolean;
  createdAt:            Date;
  updatedAt:            Date;
  handleUpdatedAt:      Date;
  planLastPaidAt:       Date | undefined;
}
