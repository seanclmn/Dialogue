import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const PUB_SUB = 'PUB_SUB';

function createRedisClient(configService: ConfigService): Redis {
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);
  const password = configService.get<string>('REDIS_PASSWORD');
  const tls = configService.get<string>('REDIS_TLS') === 'true';

  return new Redis({
    host,
    port,
    ...(password && { password }),
    ...(tls && { tls: {} }),
    retryStrategy: (times) => Math.min(times * 100, 3000),
    lazyConnect: false,
  });
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) =>
        createRedisClient(configService),
      inject: [ConfigService],
    },
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        return new RedisPubSub({
          publisher: createRedisClient(configService),
          subscriber: createRedisClient(configService),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT, PUB_SUB],
})
export class RedisModule {}
