import { Module } from '@nestjs/common';
import { UomService } from './uom.service';
import { UomController } from './uom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UomEntity } from './entities/uom.entity';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UomEntity,
    ]),
    RedisModule,
  ],
  controllers: [UomController],
  providers: [UomService],
})
export class UomModule {}
