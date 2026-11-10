import 'tsconfig-paths/register';
import dotenv from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { type SeederOptions } from 'typeorm-extension';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../modules/**/*.entity.{.ts,.js}'],
    migrations: [__dirname + '/migrations/admin/*{.ts,.js}'],
    seeds: ['src/database/seeds/main.seed.ts'],
    logging: process.env.DB_LOGGING === 'true',
    synchronize: process.env.DB_SYNCRONIZE === 'true',
};

export const AppDataSource = new DataSource(options);