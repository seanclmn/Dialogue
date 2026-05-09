import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ChatsModule } from './chats/chats.module';
import { Chat } from './chats/entities/chat.entity';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { NodeResolver } from './node/node.resolver';
import { Notification, FriendRequestNotification } from './notifications/entities/notification.entity';
import { FriendsModule } from './friends/friends.module';
import { FriendRequest as FriendRequestEntity } from './friends/entities/friend-request.entity';
import { Friendship } from './friends/entities/friendship.entity';
import { FriendRequest } from './users/entities/friendRequests.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLErrorFilter } from './common/filters/graphql-error.filter';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbHost = process.env.DB_HOST || 'localhost';
const useCloudSqlSocket = dbHost.startsWith('/cloudsql/');

const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  ...(useCloudSqlSocket
    ? { socketPath: dbHost }
    : { host: dbHost, port: 3306 }),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Chat, Message, FriendRequest, Notification, FriendRequestEntity, FriendRequestNotification, Friendship],
  synchronize: true,
  timezone: 'Z',
  retryAttempts: 5,
  retryDelay: 2000,
  connectTimeout: 10000,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      // Cloud Run image has no `src/`; K_SERVICE is set by Cloud Run on every revision
      autoSchemaFile:
        process.env.K_SERVICE != null
          ? true
          : join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      buildSchemaOptions: {
        orphanedTypes: [FriendRequestNotification],
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
    TypeOrmModule.forRoot(typeOrmOptions),
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
