import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockMovementModule } from './stock-movement/stock-movement.module';
import { StockReceiptModule } from './stock-receipt/stock-receipt.module';

@Module({
  imports: [
    StockModule, 
    StockMovementModule, 
    StockReceiptModule,
  ],
})
export class InventoryModule {}
