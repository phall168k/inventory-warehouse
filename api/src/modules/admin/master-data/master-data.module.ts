import { Module } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { CategoryModule } from './category/category.module';
import { UomModule } from './uom/uom.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    WarehouseModule,
    CategoryModule,
    UomModule,
    ProductModule,
  ],
})
export class MasterDataModule {}
