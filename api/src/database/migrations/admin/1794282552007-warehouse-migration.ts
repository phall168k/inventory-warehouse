import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

export class WarehouseMigration1794282552007 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'admin.warehouses',
            columns: [
                { 
                    name: 'id', 
                    type: 'uuid', 
                    isPrimary: true, 
                    isGenerated: true, 
                    generationStrategy: 'uuid' 
                },
                { 
                    name: 'code', 
                    type: 'varchar', 
                    length: '100', 
                    isUnique: true 
                },
                { 
                    name: 'name_en', 
                    type: 'varchar', 
                    length: '250', 
                    isUnique: true 
                },
                { 
                    name: 'name_kh', 
                    type: 'varchar', 
                    length: '250', 
                    isUnique: true 
                },
                { 
                    name: 'manager_id', 
                    type: 'uuid',
                    isNullable: true,
                },
                { 
                    name: 'address', 
                    type: 'varchar', 
                    length: '250', 
                    isNullable: true 
                },
                { 
                    name: 'contact_number', 
                    type: 'varchar', 
                    length: '150', 
                    isNullable: true 
                },
                { 
                    name: 'logo', 
                    type: 'jsonb', 
                    isNullable: true 
                },
                { 
                    name: 'created_by_id', 
                    type: 'uuid',
                    isNullable: true, 
                },
                ...commonFields,
            ],
            foreignKeys: ['manager_id', 'created_by_id'].map((name) => ({
                columnNames: [name], referencedColumnNames: ['id'],
                referencedTableName: 'admin.users', onUpdate: 'CASCADE',
            })),
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('admin.warehouses', true);
    }
}
