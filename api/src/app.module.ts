import { AuthorizationModule } from '@nestjs/authorization';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ModulesModule } from './modules/modules.module';
import { AuthenticationModule } from '@nestjs/authentication';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MinioModule,
    ModulesModule,
    AuthenticationModule.forRoot({
      accessToken: {
        key: process.env.JWT_ACCESS_SECRET,
        issuer: 'stockpro-api',
        audience: 'stockpro-client',
        ttl: '15m',
      },
      refreshToken: {
        ttl: '7d',
        absoluteTtl: '7d',
      },
    }),
    AuthorizationModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
