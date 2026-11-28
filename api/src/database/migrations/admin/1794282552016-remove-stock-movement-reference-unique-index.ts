import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class RemoveStockMovementReferenceUniqueIndex1794282552016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'admin.stock_movements',
      'UQ_stock_movements_reference_type_id_movement_type',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'admin.stock_movements',
      new TableIndex({
        name: 'UQ_stock_movements_reference_type_id_movement_type',
        columnNames: ['reference_type', 'reference_id', 'movement_type'],
        isUnique: true,
      }),
    );
  }
}
