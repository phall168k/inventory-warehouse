import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

export class StockReceiptItemMigration1794282552015 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'admin.stock_receipt_items',
      columns: [
        { 
          name: 'id', 
          type: 'uuid', 
          isPrimary: true, 
          isGenerated: true, 
          generationStrategy: 'uuid' 
        },
        { 
          name: 'stock_receipt_id', 
          type: 'uuid' 
        },
        { 
          name: 'product_id', 
          type: 'uuid' 
        },
        { 
          name: 'quantity', 
          type: 'decimal', 
          precision: 15, 
          scale: 5 
        },
        { 
          name: 'unit_cost', 
          type: 'decimal', 
          precision: 15, 
          scale: 5
         },
        { 
          name: 'note', 
          type: 'varchar', 
          length: '250', 
          isNullable: true 
        },
        ...commonFields,
      ],
      foreignKeys: [
        { 
          name: 'FK_stock_receipt_items_stock_receipt', 
          columnNames: ['stock_receipt_id'], 
          referencedTableName: 'admin.stock_receipts', 
          referencedColumnNames: ['id'], 
          onDelete: 'RESTRICT', 
          onUpdate: 'CASCADE' 
        },
        { 
          name: 'FK_stock_receipt_items_product', 
          columnNames: ['product_id'], 
          referencedTableName: 'admin.products', 
          referencedColumnNames: ['id'], 
          onDelete: 'RESTRICT', 
          onUpdate: 'CASCADE' 
        },
      ],
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin.stock_receipt_items', true);
  }
}
