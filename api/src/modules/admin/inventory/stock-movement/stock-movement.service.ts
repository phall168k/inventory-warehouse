import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockMovementRequestDto } from './dto/create-stock-movement-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { StockMovementResponseDto } from './dto/stock-movement-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovementMapper } from './stock-movement.mapper';
import { handleError } from '@/common/utils/handle-error.util';

@Injectable()
export class StockMovementService extends BasePaginationService<StockMovementEntity, StockMovementResponseDto>{
  protected SEARCHABLE_COLUMNS = [
    'product.code', 
    'product.nameEn', 
    'product.nameKh', 
    'warehouse.code', 
    'warehouse.nameEn', 
    'warehouse.nameKh'
  ];
  protected RELATIONSHIP_FIELDS = [
    'createdBy', 
    'product', 
    'warehouse'
  ];

  constructor(
    @InjectRepository(StockMovementEntity)
    private readonly stockMovementRepository: Repository<StockMovementEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<StockMovementEntity> {
    return this.stockMovementRepository;
  }

  protected getMapperResponseEntityField(
    entity: StockMovementEntity,
  ): Promise<StockMovementResponseDto> {
    return StockMovementMapper.toDto(entity);
  }

  public async create(dto: CreateStockMovementRequestDto[]): Promise<StockMovementResponseDto[]> {
    try {
      let entities = dto.map((item) => StockMovementMapper.toCreateEntity(item));
      entities = await this.stockMovementRepository.save(entities);
      return Promise.all(
        entities.map((item) => StockMovementMapper.toDto(item)),
      );
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<StockMovementResponseDto> {
    try {
      const entity = await this.stockMovementRepository.findOne({
        where: { id },
        relations: {
          product: true,
          warehouse: true,
          createdBy: true,
        },
      });
      if (!entity) throw new NotFoundException('Stock movement not found');
      return StockMovementMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
