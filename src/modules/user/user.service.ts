import { Injectable } from '@nestjs/common';
import { PostgresUserRepository } from '../../infrastructure/database/postgres/postgres.user.repository';
import { User } from '../../domain/types/user.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: PostgresUserRepository) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.findByEmail(email);
    if (user && !user.is_deleted) return user;
    return undefined;
  }

  async findByHandle(handle: string): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.findByHandle(handle);
    if (user && !user.is_deleted) return user;
    return undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.findById(id);
    if (user && !user.is_deleted) return user;
    return undefined;
  }

  async create(
    firstName: string,
    handle: string,
    email: string,
    newsletter_sub: boolean,
    passwordHash: string,
  ): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.create(
      firstName,
      handle,
      email,
      newsletter_sub,
      passwordHash,
    );
    if (user) return user;
    return undefined;
  }

  async update(
    id: string,
    firstName: string | null,
    handle: string | null,
    email: string | null,
    newsletter_sub: boolean | null,
    passwordHash: string | null,
  ): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.update(
      id,
      firstName,
      handle,
      email,
      newsletter_sub,
      passwordHash,
    );
    if (user) return user;
    return undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.deleteUser(id);
    return result.affectedRows > 0;
  }

}
