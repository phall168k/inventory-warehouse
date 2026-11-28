import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from './entities/stock.entity';
import { StockMovementModule } from '../stock-movement/stock-movement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockEntity,
    ]),
    StockMovementModule,
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
