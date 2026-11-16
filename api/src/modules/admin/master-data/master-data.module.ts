import { Module } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { CategoryModule } from './category/category.module';
import { UomModule } from './uom/uom.module';

@Module({
  imports: [
    WarehouseModule, 
    CategoryModule, 
    UomModule
  ],
})
export class MasterDataModule {}
