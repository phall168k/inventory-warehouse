import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockMovementRequestDto } from './dto/create-stock-movement-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { StockMovementResponseDto } from './dto/stock-movement-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StockMovementMapper } from './stock-movement.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { StockEntity } from '../stock/entities/stock.entity';

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
    private readonly dataSource: DataSource,
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

  public async create(
    dto: CreateStockMovementRequestDto[],
  ): Promise<StockMovementResponseDto[]> {
    try {
      if (!dto.length) return [];

      return await this.dataSource.transaction(async (manager) => {
        const stockRepository = manager.getRepository(StockEntity);
        const movementRepository = manager.getRepository(StockMovementEntity);

        const stockBalances = new Map<string, number>();
        const movements: StockMovementEntity[] = [];

        for (const item of dto) {
          const key = `${item.warehouseId}:${item.productId}`;

          let currentBalance = stockBalances.get(key);

          if (currentBalance === undefined) {
            const stock = await stockRepository.findOne({
              where: {
                warehouseId: item.warehouseId,
                productId: item.productId,
                status: true,
              },
            });

            if (!stock) {
              throw new NotFoundException(
                `Stock not found for product ${item.productId} in warehouse ${item.warehouseId}`,
              );
            }

            currentBalance =
              Number(stock.receiveQuantity ?? 0) +
              Number(stock.adjustmentQuantity ?? 0) +
              Number(stock.transferQuantity ?? 0) -
              Number(stock.issueQuantity ?? 0);
          }

          const quantityChange = Number(item.quantityChange);
          const balanceAfter = currentBalance + quantityChange;

          if (balanceAfter < 0) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.productId}`,
            );
          }

          const movement = movementRepository.create({
            productId: item.productId,
            warehouseId: item.warehouseId,
            movementType: item.movementType,
            referenceType: item.referenceType,
            referenceId: item.referenceId,
            quantityChange,
            balanceAfter,
            createdById: item.createdById,
          });

          movements.push(movement);
          stockBalances.set(key, balanceAfter);
        }

        const savedMovements = await movementRepository.save(movements);

        return Promise.all(
          savedMovements.map((item) =>
            StockMovementMapper.toDto(item),
          ),
        );
      });
    } catch (error) {
      handleError(error);
      throw error;
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
