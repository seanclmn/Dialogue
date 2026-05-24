import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Chat } from '../chats/entities/chat.entity';
import { ChatParticipant } from '../chats/entities/chat-participant.entity';
import { Message } from '../messages/entities/message.entity';
import { Notification, FriendRequestNotification } from '../notifications/entities/notification.entity';
import { FriendRequest as FriendRequestEntity } from '../friends/entities/friend-request.entity';
import { Friendship } from '../friends/entities/friendship.entity';
import { FriendRequest } from '../users/entities/friendRequests.entity';

export const typeOrmEntities = [
  User,
  Chat,
  ChatParticipant,
  Message,
  FriendRequest,
  Notification,
  FriendRequestEntity,
  FriendRequestNotification,
  Friendship,
];

function baseConnection(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
    port: process.env.NODE_ENV === 'production' ? Number(process.env.DB_PORT) : 3306,
    username: process.env.NODE_ENV === 'production' ? process.env.DB_USERNAME : 'root',
    password: process.env.NODE_ENV === 'production' ? process.env.DB_PASSWORD : 'root',
    database: process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE : 'chat',
    entities: typeOrmEntities,
    timezone: 'Z',
    extra: process.env.NODE_ENV === 'production' ? {
      socketPath: process.env.DB_SOCKET_PATH,
    } : undefined,
  } as DataSourceOptions;
}

export function getTypeOrmRootOptions(): TypeOrmModuleOptions {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const runMigrations =
    process.env.TYPEORM_MIGRATIONS_RUN === 'true' ||
    (nodeEnv === 'development' && process.env.TYPEORM_MIGRATIONS_RUN !== 'false');

  return {
    ...baseConnection(),
    synchronize: false,
    migrations: [join(__dirname, '..', 'migrations', '*.js')],
    migrationsRun: runMigrations,
    retryAttempts: 5,
    retryDelay: 2000,
  } as TypeOrmModuleOptions;
}

export function getDataSourceOptionsForCli(
  cliDirname: string,
  useTsMigrations: boolean,
): DataSourceOptions {
  const ext = useTsMigrations ? 'ts' : 'js';
  return {
    ...baseConnection(),
    synchronize: false,
    migrations: [join(cliDirname, 'migrations', `*.${ext}`)],
  } as DataSourceOptions;
}
