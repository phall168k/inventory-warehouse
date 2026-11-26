import { Module } from '@nestjs/common';
import { StockReceiptService } from './stock-receipt.service';
import { StockReceivingController } from './stock-receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockReceiptEntity } from './entities/stock-receipt.entity';
import { StockReceiptItemEntity } from './entities/stock-receipt-item.entity';
import { StockMovementModule } from '../stock-movement/stock-movement.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockReceiptEntity,
      StockReceiptItemEntity,
    ]),
    StockMovementModule,
    StockModule,
  ],
  controllers: [StockReceivingController],
  providers: [StockReceiptService],
})
export class StockReceiptModule {}
