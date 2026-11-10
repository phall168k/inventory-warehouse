import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.permissions';

export class PermissionMigration1794282552001 implements MigrationInterface {
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
                        name: 'parent_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '160',
                        isUnique: true,
                        isNullable: false,
                    },
                    ...commonFields,
                ],
                foreignKeys: [
                    {
                        name: 'FK_permissions_parent_id',
                        columnNames: ['parent_id'],
                        referencedTableName: tableName,
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                ],
                indices: [
                    {
                        name: 'IDX_permissions_parent_id',
                        columnNames: ['parent_id'],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(tableName);
        if (table) {
            for (const fk of table.foreignKeys) {
                await queryRunner.dropForeignKey(tableName, fk);
            }
            await queryRunner.dropTable(tableName);
        }
    }
}
