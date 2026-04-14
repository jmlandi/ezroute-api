import { Injectable } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { IWorkspaceRepository } from '../../../domain/repositories/workspace.repository.interface';
import { Workspace } from '../../../domain/types/workspace.type';

@Injectable()
export class PostgresWorkspaceRepository implements IWorkspaceRepository {

  constructor(private readonly postgresService: PostgresService) {}

  private async mapRowToWorkspace(row: any): Promise<Workspace> {
    return {
      id: row.id,
      owner: {
        id: row.user_id,
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
        is_deleted: row.user_is_deleted,
        createdAt: new Date(row.user_created_at),
        updatedAt: new Date(row.user_updated_at),
        handleUpdatedAt: new Date(row.handle_updated_at),
        planLastPaidAt: row.plan_last_paid_at ? new Date(row.plan_last_paid_at) : undefined,
      },
      name: row.name,
      links: [], // To be populated separately if needed
      status: row.status,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findById(id: string): Promise<Workspace | undefined> {
    const sql = `
      SELECT
        w.*,
        u.id as user_id,
        u.first_name,
        u.handle,
        u.email,
        u.password,
        p.tier,
        p.price,
        p.max_workspaces,
        p.max_members_per_workspace,
        p.max_links_per_workspace,
        u.newsletter_subscribed,
        u.profile_picture_url,
        u.is_deleted as user_is_deleted,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at,
        u.handle_updated_at,
        u.plan_last_paid_at
      FROM
        workspaces w
      JOIN
        users u ON w.owner_id = u.id
      LEFT JOIN
        plans p ON p.tier = u.plan_tier
      WHERE
        w.id = $1
      LIMIT 1;
    `;
    const params = [id];

    const queryResult = await this.postgresService.query(sql, params);
    return queryResult.rows.length > 0 ? await this.mapRowToWorkspace(queryResult.rows[0]) : undefined;
  }

  async findByOwnerId(ownerId: string): Promise<Workspace[] | undefined> {
    const sql = `
      SELECT
        w.*,
        u.id as user_id,
        u.first_name,
        u.handle,
        u.email,
        u.password,
        p.tier,
        p.price,
        p.max_workspaces,
        p.max_members_per_workspace,
        p.max_links_per_workspace,
        u.newsletter_subscribed,
        u.profile_picture_url,
        u.is_deleted as user_is_deleted,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at,
        u.handle_updated_at,
        u.plan_last_paid_at
      FROM
        workspaces w
      JOIN
        users u ON w.owner_id = u.id
      LEFT JOIN
        plans p ON p.tier = u.plan_tier
      WHERE
        w.owner_id = $1
      ORDER BY
        w.created_at DESC;
    `;
    const params = [ownerId];

    const queryResult = await this.postgresService.query(sql, params);
    if (queryResult.rows.length === 0) return undefined;

    const workspaces = await Promise.all(
      queryResult.rows.map(row => this.mapRowToWorkspace(row))
    );
    return workspaces;
  }

  async create(
    ownerId: string,
    name: string,
  ): Promise<Workspace | undefined> {
    const sql = `
      INSERT INTO workspaces
        (owner_id, name, status, created_at, updated_at)
      VALUES
        ($1, $2, 'active', NOW(), NOW())
      RETURNING
        *;
    `;
    const params = [ownerId, name];

    const queryResult = await this.postgresService.query(sql, params);

    if (queryResult.rows.length > 0) {
      return this.findById(queryResult.rows[0].id);
    }
    return undefined;
  }

  async update(
    id: string,
    name: string | null,
    status: 'active' | 'suspended' | 'deactivated' | null,
  ): Promise<Workspace | undefined> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (name !== null) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }
    if (status !== null) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `
      UPDATE workspaces
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const queryResult = await this.postgresService.query(sql, params);

    if (queryResult.rows.length > 0) {
      return this.findById(queryResult.rows[0].id);
    }
    return undefined;
  }

  async delete(id: string): Promise<{ affectedRows: number }> {
    const sql = `
      DELETE FROM workspaces
      WHERE id = $1;
    `;
    const params = [id];

    const queryResult = await this.postgresService.query(sql, params);
    return { affectedRows: queryResult.rowCount || 0 };
  }

}
