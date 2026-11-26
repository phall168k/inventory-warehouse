import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

export class StockReceiptMigration1794282552014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'admin.stock_receipts',
      columns: [
        { 
          name: 'id', 
          type: 'uuid', 
          isPrimary: true, 
          isGenerated: true, 
          generationStrategy: 'uuid' 
        },
        { 
          name: 'document_number', 
          type: 'varchar', 
          length: '150',
          isUnique: true, 
        },
        { 
          name: 'warehouse_id', 
          type: 'uuid' 
        },
        { 
          name: 'receipt_date', 
          type: 'date' 
        },
        { 
          name: 'reference_no', 
          type: 'varchar', 
          length: '150' 
        },
        { 
          name: 'description', 
          type: 'varchar', 
          length: '250', 
          isNullable: true 
        },
        { 
          name: 'status', 
          type: 'enum', 
          enum: [
            'DRAFT', 
            'POSTED', 
            'CANCELLED'
          ], 
          enumName: 'stock_receipts_status_enum' 
        },
        { 
          name: 'total_quantity', 
          type: 'decimal', 
          precision: 15, 
          scale: 5 
        },
        { 
          name: 'created_by_id', 
          type: 'uuid' 
        },
        { 
          name: 'posted_by_id', 
          type: 'uuid', 
          isNullable: true 
        },
        { 
          name: 'posted_at', 
          type: 'timestamptz', 
          isNullable: true 
        },
        { 
          name: 'attachments', 
          type: 'jsonb', 
          isNullable: true 
        },
        ...commonFields,
      ],
      uniques: [
        { 
          name: 'UQ_stock_receipts_document_number', 
          columnNames: ['document_number'] 
        }
      ],
      foreignKeys: [
        { 
          name: 'FK_stock_receipts_warehouse', 
          columnNames: ['warehouse_id'], 
          referencedTableName: 'admin.warehouses', 
          referencedColumnNames: ['id'], 
          onDelete: 'RESTRICT', 
          onUpdate: 'CASCADE' 
        },
        { 
          name: 'FK_stock_receipts_created_by', 
          columnNames: ['created_by_id'], 
          referencedTableName: 'admin.users', 
          referencedColumnNames: ['id'], 
          onDelete: 'RESTRICT', 
          onUpdate: 'CASCADE' 
        },
        { 
          name: 'FK_stock_receipts_posted_by', 
          columnNames: ['posted_by_id'], 
          referencedTableName: 'admin.users', 
          referencedColumnNames: ['id'], 
          onDelete: 'SET NULL', 
          onUpdate: 'CASCADE' 
        },
      ],
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin.stock_receipts', true);
  }
}
