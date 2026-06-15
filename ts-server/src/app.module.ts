import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { NodeResolver } from './node/node.resolver';
import { FriendsModule } from './friends/friends.module';
import { getTypeOrmRootOptions } from './database/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { APP_FILTER } from '@nestjs/core';
import { RedisModule } from './redis/redis.module';
import { GraphQLErrorFilter } from './common/filters/graphql-error.filter';
import { CacheModule } from '@nestjs/cache-manager';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { Notification } from './notifications/entities/notification.entity';

const nodeEnv = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${nodeEnv}`],
    }),
    GraphQLModule.forRoot({
      // Cloud Run image has no `src/`; K_SERVICE is set by Cloud Run on every revision
      autoSchemaFile:
        process.env.K_SERVICE != null
          ? true
          : join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      driver: ApolloDriver,
      playground: false,
      plugins: [
        nodeEnv === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
      buildSchemaOptions: {
        orphanedTypes: [Notification],
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: any) => {
            const { connectionParams } = context;
            return { req: { headers: connectionParams } };
          },
        },
      },
      context: ({ req, extra }) => {
        if (extra) {
          return { req: extra.req };
        }
        return { req };
      },
    }),
    CacheModule.register({ isGlobal: true, ttl: 5 * 60 * 1000 }),
    TypeOrmModule.forRoot(getTypeOrmRootOptions()),
    RedisModule,
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
    FriendsModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 100,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    NotificationsModule
  ],
  providers: [
    NodeResolver,
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter,
    },
  ],
})
export class AppModule { }
