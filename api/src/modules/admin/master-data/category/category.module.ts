import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
    ]),
    RedisModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
