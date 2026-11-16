import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

export class CategoryMigration1794282552009 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'admin.categories',
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
                    length: '150', 
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
                    name: 'status', 
                    type: 'boolean', 
                    default: true,
                    isNullable: false, 
                },
                { 
                    name: 'created_by_id', 
                    type: 'uuid',
                    isNullable: true, 
                },
                ...commonFields,
            ],
            foreignKeys: ['created_by_id'].map((name) => ({
                columnNames: [name], referencedColumnNames: ['id'],
                referencedTableName: 'admin.users', onUpdate: 'CASCADE',
            })),
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('admin.categories', true);
    }
}
