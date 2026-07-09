import { DataSource } from 'typeorm';
import { typeOrmEntities } from './database/typeorm.config';

const sslCa = process.env.DB_SSL_CA
  ? Buffer.from(process.env.DB_SSL_CA, 'base64').toString('utf-8')
  : undefined;

const ds = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: typeOrmEntities,
  timezone: 'Z',
  ssl: sslCa ? { ca: sslCa, rejectUnauthorized: true } : undefined,
  synchronize: true,
});

const MIGRATIONS = [
  { timestamp: 1747816052000, name: 'MakeChatNameNullable1747816052000' },
  { timestamp: 1748044800000, name: 'AddChatParticipant1748044800000' },
  { timestamp: 1748044900000, name: 'FixLastReadMessageRelation1748044900000' },
];

async function main() {
  console.log('Connecting to database...');
  await ds.initialize();
  console.log('Connected. Synchronizing schema...');
  console.log('Schema synchronized. Marking migrations as run...');
  for (const m of MIGRATIONS) {
    await ds.query(
      `INSERT INTO migrations (timestamp, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id`,
      [m.timestamp, m.name],
    );
    console.log(`  ✓ ${m.name}`);
  }
  console.log('Done.');
  await ds.destroy();
}

main().catch((e) => { console.error(e); process.exit(1); });
