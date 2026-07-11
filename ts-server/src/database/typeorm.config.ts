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
  const isProd = process.env.NODE_ENV === 'production';

  // DB_SSL_CA: base64-encoded CA cert (e.g. from Aiven). When set, connects over
  // TLS instead of a Cloud SQL Unix socket.
  const sslCa = process.env.DB_SSL_CA
    ? Buffer.from(process.env.DB_SSL_CA, 'base64').toString('utf-8')
    : undefined;

  return {
    type: 'mysql',
    host: isProd ? process.env.DB_HOST : 'localhost',
    port: isProd ? Number(process.env.DB_PORT ?? 3306) : 3306,
    username: isProd ? process.env.DB_USERNAME : 'root',
    password: isProd ? process.env.DB_PASSWORD : 'root',
    database: isProd ? process.env.DB_DATABASE : 'chat',
    entities: typeOrmEntities,
    timezone: 'Z',
    ssl: sslCa ? { ca: sslCa, rejectUnauthorized: true } : undefined,
    extra: isProd && !sslCa && process.env.DB_SOCKET_PATH ? {
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
