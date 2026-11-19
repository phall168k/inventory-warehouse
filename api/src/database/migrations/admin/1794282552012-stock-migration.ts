import { 
  MigrationInterface, 
  QueryRunner, 
  Table 
} from 'typeorm';
import { commonFields } from '../common.fields';

export class StockMigration1794282552012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin.stocks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { 
            name: 'product_id', 
            type: 'uuid' 
          },
          { 
            name: 'warehouse_id', 
            type: 'uuid' 
          },
          {
            name: 'min_stock',
            type: 'decimal',
            precision: 14,
            scale: 5,
            default: 0,
          },
          {
            name: 'receive_quantity',
            type: 'decimal',
            precision: 14,
            scale: 5,
            default: 0,
          },
          {
            name: 'issue_quantity',
            type: 'decimal',
            precision: 14,
            scale: 5,
            default: 0,
          },
          {
            name: 'transfer_quantity',
            type: 'decimal',
            precision: 14,
            scale: 5,
            default: 0,
          },
          {
            name: 'adjustment_quantity',
            type: 'decimal',
            precision: 14,
            scale: 5,
            default: 0,
          },
          {
            name: 'created_by_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          ...commonFields,
        ],
        uniques: [
          {
            name: 'UQ_stocks_product_warehouse',
            columnNames: [
              'product_id',
              'warehouse_id',
            ],
          },
        ],
        foreignKeys: [
          {
            name: 'FK_stocks_product',
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.products',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_stocks_warehouse',
            columnNames: ['warehouse_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.warehouses',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_stocks_created_by',
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.users',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin.stocks', true);
  }
}
