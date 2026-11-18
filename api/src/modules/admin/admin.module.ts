import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { MasterDataModule } from './master-data/master-data.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    SystemModule, 
    MasterDataModule, 
    InventoryModule,
  ]
})
export class AdminModule {}
