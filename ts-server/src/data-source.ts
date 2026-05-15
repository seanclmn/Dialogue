import 'reflect-metadata';
import { join } from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { getDataSourceOptionsForCli } from './database/typeorm.config';

config({ path: join(__dirname, '..', '.env') });

const useTsMigrations = __filename.endsWith('.ts');

export default new DataSource(getDataSourceOptionsForCli(__dirname, useTsMigrations));
