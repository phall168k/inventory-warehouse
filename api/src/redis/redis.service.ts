import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { REDIS_CLIENT, REDIS_DEFAULT_TTL } from './constants/redis.contants';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: Redis,
        private readonly configService: ConfigService,
    ) {}

    // Get cache object
    public async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);

        if (value === null) {
            return null;
        }

        return JSON.parse(value) as T;
    }

    // Store a cached object with an expiration time
    public async set<T>(
        key: string,
        value: T,
        ttl?: number, 
    ): Promise<void> {
        const second = ttl ?? Number(this.configService.get('REDIS_CACH_TTL', REDIS_DEFAULT_TTL),);

        if (!Number.isInteger(second) || second <= 0) {
            throw new Error('Redis TTL must be a positive integer');
        }

        await this.redis.set(
            key,
            JSON.stringify(value),
            'EX',
            second,
        );
    }

    // Delete one or multiple cache keys
    public async del(...keys: string[]): Promise<number> {
        if (keys.length === 0) {
            return 0;
        }

        return this.redis.del(...keys);
    }

    // Check wether a key exists
    public async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) > 0;
    }

    // Get remaining expiration time in second
    public async ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    // Cache-aside helper
    public async getOrSet<T>(
        key: string,
        factory: () => Promise<T>,
        ttl?: number,
    ): Promise<T> {
        const cached = await this.get<T>(key);

        if (cached !== null) {
        return cached;
        }

        const result = await factory();

        // Do not cache missing records
        if (result !== null && result !== undefined) {
        await this.set(key, result, ttl);
        }

        return result;
    }

    // Delete keys by pattern using SCAN
    public async deleteByPattern(
        pattern: string,
    ): Promise<number> {
        const prefix = this.configService.get<string>(
            'REDIS_KEY_PREFIX',
            'stockpro:'
        );

        let cursor = '0';
        let deleted = 0;

        do {
            const [nextCursor, keys] = await this.redis.scan(
                cursor,
                'MATCH',
                `${prefix}${pattern}`,
                'COUNT',
                100,
            );

            cursor = nextCursor;

            if (keys.length > 0) {
                const logicalKeys = keys.map((key) => key.slice(prefix.length));

                deleted += await this.redis.del(...logicalKeys);
            }
        } while (cursor !== '0');

        return deleted;
    }

    // Gracefully close Redis connection
    public async onApplicationShutdown(): Promise<void> {
        if (this.redis.status === 'end') {
            return;
        }

        if (this.redis.status === 'ready') {
            await this.redis.quit();
        } else {
            this.redis.disconnect();
        }
    }


}
