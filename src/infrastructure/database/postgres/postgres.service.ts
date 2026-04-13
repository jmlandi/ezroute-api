import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PostgresService.name);
    private pool: Pool;

    constructor() {
     this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process?.env?.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
        });
    }

    async onModuleInit() {
        try {
            const client = await this.pool.connect();

            this.logger.log('PostgreSQL connected');

            await this.runInitSQL();

            client.release();
        } catch (error) {
            this.logger.error('PostgreSQL connection failed', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.pool.end();
        this.logger.log('PostgreSQL disconnected');
    }

    private async runInitSQL() {
        try {
            const filePath = path.join(process.cwd(), './src/infrastructure/database/postgres/init.sql');
            const sql = fs.readFileSync(filePath, 'utf-8');

            this.logger.log('Running init.sql...');

            await this.pool.query(sql);

            this.logger.log('init.sql executed successfully');
        } catch (error) {
            this.logger.error('Failed to run init.sql', error);
            throw error;
        }
    }

    async query(text: string, params?: any[]) {
        return this.pool.query(text, params);
    }
}
