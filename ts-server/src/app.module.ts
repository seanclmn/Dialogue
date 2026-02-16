import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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
import { Notification } from './notifications/entities/notification.entity';
import { FriendRequest } from './users/entities/friendRequests.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      driver: ApolloDriver,
      playground: true,
      subscriptions: {
        'graphql-ws': true
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'chat',
      entities: [User, Chat, Message, FriendRequest, Notification],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
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
  providers: [NodeResolver],
})
export class AppModule { }
