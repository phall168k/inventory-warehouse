import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UsersWarehousesMigration1794282552008 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'admin.users_warehouses',
            columns: [
                { 
                    name: 'user_id', 
                    type: 'uuid', 
                    isPrimary: true 
                },
                { 
                    name: 'warehouse_id', 
                    type: 'uuid', 
                    isPrimary: true 
                },
            ],
            foreignKeys: [
                { 
                    columnNames: ['user_id'], 
                    referencedColumnNames: ['id'], 
                    referencedTableName: 'admin.users', 
                    onUpdate: 'CASCADE', 
                    onDelete: 'CASCADE' 
                },
                { 
                    columnNames: ['warehouse_id'], 
                    referencedColumnNames: ['id'], 
                    referencedTableName: 'admin.warehouses', 
                    onUpdate: 'CASCADE', 
                    onDelete: 'CASCADE' 
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('admin.users_warehouses', true);
    }
}
