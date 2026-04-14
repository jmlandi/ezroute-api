import { IsNumber, IsString, IsEnum, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  PORT: number = 3001;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  REDIS_URL: string = 'redis://localhost:6379';

  @IsString()
  JWT_TOKEN!: string;

  @IsString()
  CASSANDRA_CONTACT_POINTS: string = 'localhost';

  @IsString()
  CASSANDRA_DATA_CENTER: string = 'datacenter1';

  @IsString()
  CASSANDRA_KEYSPACE: string = 'ezroute';

  @IsString()
  AMPLITUDE_API_KEY?: string;

  @IsString()
  BRAZE_API_KEY?: string;

  @IsString()
  RESEND_API_KEY?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors
        .map((error) => `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`)
        .join('\n')}`,
    );
  }
  return validatedConfig;
}

export type IEnvironmentVariables = EnvironmentVariables;
