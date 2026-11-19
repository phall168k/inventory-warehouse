import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';

@Module({
  imports: [StockModule, StockMovementModule]
})
export class InventoryModule {}
