import { Injectable } from '@nestjs/common';
import { ILinkRepository } from "../../../domain/repositories/link.repository.interface";
import { createLink } from "../../../domain/types/link.types";
import { PostgresService } from "./postgres.service";

@Injectable()
export class PostgresLinkRepository implements ILinkRepository {
  constructor(private readonly postgresService: PostgresService) { }

  async create(link: createLink): Promise<any> {
    const query = `
      INSERT INTO
        links_metadata (short_code, original_url, workspace_id, created_by, search_params, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const params = [link.shortCode, link.originalUrl, link.workspaceId, link.userId, link.searchParams, link.createdAt];
    await this.postgresService.query(query, params);
  }
  async findByShortCode(shortCode: string): Promise<any> {
    const query = `
      SELECT
        * 
      FROM
        links_metadata
      WHERE
        short_code = $1
    `;
    const params = [shortCode];
    const result = await this.postgresService.query(query, params);
    return result.rows[0];
  }
}
