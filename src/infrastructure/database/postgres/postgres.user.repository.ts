import { Injectable } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/types/user.type';

@Injectable()
export class PostgresUserRepository implements IUserRepository {

  constructor (private readonly postgresService: PostgresService) {}
 
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      firstName: row.first_name,
      handle: row.handle,
      email: row.email,
      password: row.password,
      plan: {
        tier: row.tier,
        price: row.price,
        maxWorkspaces: row.max_workspaces,
        maxMembersPerWorkspace: row.max_members_per_workspace,
        maxLinksPerWorkspace: row.max_links_per_workspace,
      },
      newsletterSubscribed: row.newsletter_subscribed,
      profilePictureUrl: row.profile_picture_url,
      is_deleted: row.is_deleted,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      handleUpdatedAt: new Date(row.handle_updated_at),
      planLastPaidAt: row.plan_last_paid_at ? new Date(row.plan_last_paid_at) : undefined,
    };
  }

  async findById(id: string): Promise<User | undefined> {
    const sql = `
      SELECT
        u.*,
        p.tier,
        p.price,
        p.max_workspaces,
        p.max_members_per_workspace,
        p.max_links_per_workspace
      FROM
        users u
      LEFT JOIN
        plans p
          ON p.tier = u.plan_tier
      WHERE
        u.id = $1
      LIMIT
        1;
    `;
    const params = [id];

    const queryResult = await this.postgresService.query(sql, params);
    return queryResult.rows.length > 0 ? this.mapRowToUser(queryResult.rows[0]) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const sql = `
      SELECT
        u.*,
        p.tier,
        p.price,
        p.max_workspaces,
        p.max_members_per_workspace,
        p.max_links_per_workspace
      FROM
        users u
      LEFT JOIN
        plans p
          ON p.tier = u.plan_tier
      WHERE
        u.email = $1
      LIMIT
        1;
    `;
    const params = [email];

    const queryResult = await this.postgresService.query(sql, params);
    return queryResult.rows.length > 0 ? this.mapRowToUser(queryResult.rows[0]) : undefined;
  }

  async findByHandle(handle: string): Promise<User | undefined> {
    const sql = `
      SELECT
        u.*,
        p.tier,
        p.price,
        p.max_workspaces,
        p.max_members_per_workspace,
        p.max_links_per_workspace
      FROM
        users u
      LEFT JOIN
        plans p
          ON p.tier = u.plan_tier
      WHERE
        u.handle = $1
      LIMIT
        1;
    `;
    const params = [handle];

    const queryResult = await this.postgresService.query(sql, params);
    return queryResult.rows.length > 0 ? this.mapRowToUser(queryResult.rows[0]) : undefined;
  }

  async create(
    firstName: string,
    handle: string,
    email: string,
    newsletter_sub: boolean,
    password: string,
  ): Promise<User | undefined> {
    const sql = `
      INSERT INTO users
        (first_name, handle, email, newsletter_subscribed, password, plan_tier, created_at, updated_at, handle_updated_at, is_deleted)
      VALUES
        ($1, $2, $3, $4, $5, 'free', NOW(), NOW(), NOW(), false)
      RETURNING
        *;
    `;
    const params = [firstName, handle, email, newsletter_sub, password];

    const queryResult = await this.postgresService.query(sql, params);
    
    if (queryResult.rows.length > 0) {
      const user = queryResult.rows[0];
      const userWithPlan = await this.findById(user.id);
      return userWithPlan;
    }
    return undefined;
  }

  async update(
    id: string,
    firstName: string | null,
    handle: string | null,
    email: string | null,
    newsletter_sub: boolean | null,
    password: string | null,
  ): Promise<User | undefined> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (firstName !== null) {
      updates.push(`first_name = $${paramIndex}`);
      params.push(firstName);
      paramIndex++;
    }
    if (handle !== null) {
      updates.push(`handle = $${paramIndex}`);
      params.push(handle);
      paramIndex++;
      updates.push(`handle_updated_at = NOW()`);
    }
    if (email !== null) {
      updates.push(`email = $${paramIndex}`);
      params.push(email);
      paramIndex++;
    }
    if (newsletter_sub !== null) {
      updates.push(`newsletter_subscribed = $${paramIndex}`);
      params.push(newsletter_sub);
      paramIndex++;
    }
    if (password !== null) {
      updates.push(`password = $${paramIndex}`);
      params.push(password);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const queryResult = await this.postgresService.query(sql, params);
    
    if (queryResult.rows.length > 0) {
      const user = queryResult.rows[0];
      const userWithPlan = await this.findById(user.id);
      return userWithPlan;
    }
    return undefined;
  }

  async deleteUser(id: string): Promise<{ affectedRows: number }> {
    const sql = `
      UPDATE users
      SET is_deleted = true, updated_at = NOW()
      WHERE id = $1;
    `;
    const params = [id];

    const queryResult = await this.postgresService.query(sql, params);
    return { affectedRows: queryResult.rowCount || 0 };
  }

}
