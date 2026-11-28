import { Module } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { StockMovementController } from './stock-movement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { StockEntity } from '../stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovementEntity,
      StockEntity,
    ]),
  ],
  controllers: [StockMovementController],
  providers: [StockMovementService],
  exports: [StockMovementService],
})
export class StockMovementModule {}
