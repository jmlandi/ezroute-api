import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit, OnModuleDestroy {
  public client: Client;
  private readonly logger = new Logger(CassandraService.name);

  constructor() {
    this.client = new Client({
      contactPoints: ['localhost'],
      localDataCenter: 'datacenter1',
      keyspace: 'ezroute',
    });
  }

  async onModuleInit() {
    this.logger.log('Initializing Cassandra Service...');

    const initClient = new Client({
      contactPoints: ['localhost'],
      localDataCenter: 'datacenter1',
    });

    await initClient.connect();

    await initClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ezroute 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    `);

    await initClient.execute(`
      CREATE TABLE IF NOT EXISTS ezroute.links_by_code (
        "shortCode" text PRIMARY KEY,
        "originalUrl" text,
        "workspaceId" text,
        "isActive" boolean,
        "createdAt" timestamp
      )
    `);

    await initClient.execute(`
      CREATE TABLE IF NOT EXISTS ezroute.clicks_by_link (
        "shortCode" text,
        "referrer" text,
        "userAgent" text,
        "ip" text,
        "eventTime" timestamp,
        PRIMARY KEY ("shortCode", "eventTime")
      ) WITH CLUSTERING ORDER BY ("eventTime" DESC);
    `)

    await initClient.shutdown();

    // Now connect the main client which bounds to the ezroute keyspace
    await this.client.connect();
    this.logger.log('Cassandra Service fully connected');
  }

  async onModuleDestroy() {
    await this.client.shutdown();
  }
}
