import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from './constants/redis.contants';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({

  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        const redis = new Redis({
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: configService.get<number>('REDIS_DB', 0),
          keyPrefix: configService.get<string>('REDIS_KEY_PREFIX'),
          maxRetriesPerRequest: 2,
          retryStrategy: (times: number) => Math.min(times * 200, 2000),
          enableReadyCheck: true,
          connectTimeout: 10000,
        });

        redis.on('ready', () => {
          console.log('[Redis] Connected successfully');
        });

        return redis;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
