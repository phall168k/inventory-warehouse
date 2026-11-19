import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { commonFields } from '../common.fields';

export class StockMovementMigration1794282552013 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin.stock_movements',
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
            name: 'movement_type',
            type: 'enum',
            enum: [
              'OPENING', 
              'RECEIPT', 
              'ISSUE', 
              'TRANSFER_IN', 
              'TRANSFER_OUT', 
              'ADJUSTMENT'
            ],
            enumName: 'stock_movements_movement_type_enum',
          },
          { 
            name: 'reference_type', 
            type: 'varchar', 
            length: '30' 
          },
          { 
            name: 'reference_id', 
            type: 'uuid' 
          },
          { 
            name: 'quantity_change', 
            type: 'decimal', 
            precision: 14, 
            scale: 5 
          },
          { 
            name: 'balance_after', 
            type: 'decimal', 
            precision: 14, 
            scale: 5 
          },
          { 
            name: 'created_by_id', 
            type: 'uuid' 
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            name: 'FK_stock_movements_product',
            columnNames: ['product_id'],
            referencedTableName: 'admin.products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_stock_movements_warehouse',
            columnNames: ['warehouse_id'],
            referencedTableName: 'admin.warehouses',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_stock_movements_created_by',
            columnNames: ['created_by_id'],
            referencedTableName: 'admin.users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndices('admin.stock_movements', [
      new TableIndex({
        name: 'IDX_stock_movements_product_warehouse_created_at',
        columnNames: [
          'product_id', 
          'warehouse_id', 
          'created_at',
        ],
      }),
      new TableIndex({
        name: 'UQ_stock_movements_reference_type_id_movement_type',
        columnNames: [
          'reference_type', 
          'reference_id', 
          'movement_type',
        ],
        isUnique: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin.stock_movements', true);
  }
}
