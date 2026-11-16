import { Module } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [WarehouseModule, CategoryModule]
})
export class MasterDataModule {}
