import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { StockModule } from '../../inventory/stock/stock.module';
import { StockEntity } from '../../inventory/stock/entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      StockEntity,
    ]),
    StockModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
