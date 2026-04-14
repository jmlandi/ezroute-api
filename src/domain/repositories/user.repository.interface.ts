import { User } from '../types/user.type';

export interface IUserRepository {

  findById(id: string): Promise<User | undefined>;

  findByEmail(email: string): Promise<User | undefined>;

  findByHandle(handle: string): Promise<User | undefined>;

  create(
    firstName: string,
    handle: string,
    email: string,
    newsletter_sub: boolean,
    passwordHash: string,
  ): Promise<User | undefined>;

  update(
    id: string,
    firstName: string | null,
    handle: string | null,
    email: string | null,
    newsletter_sub: boolean | null,
    passwordHash: string | null,
  ): Promise<User | undefined>;

  deleteUser(id: string): Promise<{ affectedRows: number }>;

}
