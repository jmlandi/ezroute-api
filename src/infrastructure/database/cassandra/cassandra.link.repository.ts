import { Injectable } from '@nestjs/common';
import { CassandraService } from './cassandra.service';
import { ILinkCassandraRepository } from '../../../domain/repositories/linkCassandra.repository.interface';

@Injectable()
export class CassandraLinkRepository implements ILinkCassandraRepository {
  constructor(private readonly cassandraService: CassandraService) { }

  async create(link: any): Promise<any> {
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
    const query = 'SELECT "originalUrl" FROM ezroute.links_by_code WHERE "shortCode" = ?';
    const result = await this.cassandraService.client.execute(query, [shortCode], { prepare: true });
    const row = result.first();
    if (!row) return null;
    const url = row.get('originalUrl');
    // console.log('DEBUG - URL value:', url);
    // console.log('DEBUG - URL type:', typeof url);
    // console.log('DEBUG - URL keys:', Object.keys(url));
    // console.log('DEBUG - URL constructor:', url?.constructor?.name);
    return url;
  }

  async insertClick(click: any) {
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
