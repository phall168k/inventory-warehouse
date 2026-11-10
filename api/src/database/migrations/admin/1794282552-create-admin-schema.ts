import { MigrationInterface, QueryRunner } from "typeorm";

const schemaName = 'admin';

export class CreateAdminSchema1794282552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema(schemaName, true);
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropSchema(schemaName, true, true);
    }

}
