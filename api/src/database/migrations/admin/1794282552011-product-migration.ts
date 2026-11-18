import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

export class ProductMigration1794282552011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin.products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '150',
            isUnique: true,
          },
          {
            name: 'name_en',
            type: 'varchar',
            length: '250',
            isUnique: true,
          },
          {
            name: 'name_kh',
            type: 'varchar',
            length: '250',
            isUnique: true,
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
          { 
            name: 'category_id', 
            type: 'uuid' 
          },
          { 
            name: 'uom_id', 
            type: 'uuid' 
          },
          { 
            name: 'thumbnail', 
            type: 'jsonb', 
            isNullable: true 
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.users',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.categories',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['uom_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.uoms',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin.products', true);
  }
}
