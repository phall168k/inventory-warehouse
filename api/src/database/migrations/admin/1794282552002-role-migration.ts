import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.roles';

export class RoleMigration1794282552002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isGenerated: true,
                        isNullable: false,
                    },
                    {
                        name: 'name_en',
                        type: 'varchar',
                        length: '150',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'name_kh',
                        type: 'varchar',
                        length: '150',
                        isUnique: true,
                        isNullable: false,
                    },
                    ...commonFields,
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable(tableName, true);
    }
}
