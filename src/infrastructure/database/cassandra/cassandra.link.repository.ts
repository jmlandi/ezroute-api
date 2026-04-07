import { Injectable } from '@nestjs/common';
import { CassandraService } from './cassandra.service';
import { createLink, insertClick } from '../../../domain/types/link.types';
import { ILinkCassandraRepository } from '../../../domain/repositories/linkCassandra.repository.interface';

@Injectable()
export class CassandraLinkRepository implements ILinkCassandraRepository {
  constructor(private readonly cassandraService: CassandraService) { }

  async create(link: createLink): Promise<any> {
    const query = 'INSERT INTO ezroute.links_by_code ("shortCode", "originalUrl", "workspaceId", "isActive", "createdAt") VALUES (?, ?, ?, ?, ?)';
    const params = [
      link.shortCode,
      link.originalUrl,
      link.workspaceId,
      link.isActive ?? true,
      link.createdAt || new Date(),
    ];
    await this.cassandraService.client.execute(query, params, { prepare: true });
    return link;
  }

  async findByShortCode(shortCode: string): Promise<any> {
    const query = 'SELECT * FROM ezroute.links_by_code WHERE "shortCode" = ?';
    const result = await this.cassandraService.client.execute(query, [shortCode], { prepare: true });
    return result.first();
  }

  async insertClick(click: insertClick) {
    const query = 'INSERT INTO ezroute.clicks_by_link ("shortCode", "referrer", "userAgent", "ip", "eventTime") VALUES (?, ?, ?, ?, ?)';
    const params = [
      click.shortCode,
      click.referrer,
      click.userAgent,
      click.ip,
      click.eventTime,
    ];
    await this.cassandraService.client.execute(query, params, { prepare: true });
  }
}
