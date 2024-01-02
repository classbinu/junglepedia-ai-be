import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: 5432,
      username: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DATABASE'),
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production', // 프로덕션 환경에서는 false로 설정
      autoLoadEntities: true,
      ssl: process.env.NODE_ENV !== 'production',
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }
}
