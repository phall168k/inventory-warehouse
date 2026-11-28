import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { StockEntity } from './entities/stock.entity';
import { StockResponseDto } from './dto/stock-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsRelations, FindOptionsWhere, Not, Repository } from 'typeorm';
import { StockMapper } from './stock.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { StockSelectOptionResponseDto } from './dto/stock-select-option-response.dto';
import { StockSelectOptionFilterReuestDto } from './dto/stock-select-option-filter-request.dto';
import { StockSummaryResponseDto } from './dto/stock-summary-response.dto';
import { StockIncreaseRequestDto } from './dto/stock-increase-request.dto';
import { StockStatusEnum } from '../stock-receipt/entities/stock-receipt.entity';
import { StockMovementService } from '../stock-movement/stock-movement.service';

@Injectable()
export class StockService extends BasePaginationService<
  StockEntity, 
  StockResponseDto
> {
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
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    private readonly dataSource: DataSource,
    private readonly stockMovementService: StockMovementService,
  ) {
    super();
  }

  protected get repository(): Repository<StockEntity> {
    return this.stockRepository;
  }

  protected getMapperResponseEntityField(
    entity: StockEntity,
  ): Promise<StockResponseDto> {
    return StockMapper.toDto(entity);
  }

  public async create(dto: CreateStockRequestDto[]): Promise<StockResponseDto[]> {
    try {
      const entities = dto.map((item) => StockMapper.toCreateEntity(item));
      const savedStocks =
      await this.stockRepository.manager.transaction(
        async (manager) => {
          return manager.save(StockEntity, entities);
        },
      );

      return await Promise.all(
        savedStocks.map((stock) =>
          StockMapper.toDto(stock),
        ),
      );
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(dto: StockSelectOptionFilterReuestDto): Promise<StockSelectOptionResponseDto[]> {
    try {
      const query = await this.stockRepository.createQueryBuilder('stock')
        .leftJoin('stock.warehouse', 'warehouse')
        .innerJoinAndSelect('stock.product', 'product')
        .where('stock.warehouseId = :warehouseId', {
          warehouseId: dto.warehouseId,
        })
        .andWhere('stock.status = :status', {
          status: true
        });
        if (dto.categoryId) {
          query.andWhere('product.categoryId = :categoryId', {
            categoryId: dto.categoryId,
          });
        }
        const entities = await query.getMany();
        const itemsMapped = Promise.all(
          entities.map((item) => StockMapper.toSelectOptionDto(item)),
        );

        return itemsMapped;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<StockResponseDto> {
    try {
      const entity = await this.stockRepository.findOne({
        where: { id },
        relations: {
          warehouse: true,
          product: true,
          createdBy: true,
        }
      });
      if (!entity) throw new NotFoundException('Stock not found');
      return StockMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: string, dto: UpdateStockRequestDto): Promise<StockResponseDto> {
    try {
      let entity = await this.stockRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Stock not found');
      entity = StockMapper.toUpdateEntity(entity, dto);
      entity = await this.stockRepository.save(entity);
      return StockMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.stockRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Stock not found');
      await this.stockRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }

  public async summary(): Promise<StockSummaryResponseDto> {
    try {
      const balance = '(stock.receiveQuantity + stock.transferQuantity + stock.adjustmentQuantity - stock.issueQuantity)';
      const result = await this.stockRepository.createQueryBuilder('stock')
        .select('COUNT(*)', 'totalStocks')
        .addSelect('COUNT(DISTINCT stock.productId)', 'totalProducts')
        .addSelect('COUNT(DISTINCT stock.warehouseId)', 'totalWarehouses')
        .addSelect(`COUNT(*) FILTER (WHERE ${balance} > 0 AND ${balance} <= stock.minStock)`, 'lowStockCount')
        .addSelect(`COUNT(*) FILTER (WHERE ${balance} <= 0)`, 'outOfStockCount')
        .addSelect(`COALESCE(SUM(${balance}), 0)`, 'totalStockQuantity')
        .addSelect('COALESCE(SUM(stock.receiveQuantity), 0)', 'totalReceiveQuantity')
        .addSelect('COALESCE(SUM(stock.issueQuantity), 0)', 'totalIssueQuantity')
        .addSelect('COALESCE(SUM(stock.transferQuantity), 0)', 'totalTransferQuantity')
        .addSelect('COALESCE(SUM(stock.adjustmentQuantity), 0)', 'totalAdjustmentQuantity')
        .getRawOne<StockSummaryResponseDto>();

      return {
        ...result,
        totalStocks: Number(result.totalStocks),
        totalProducts: Number(result.totalProducts),
        totalWarehouses: Number(result.totalWarehouses),
        lowStockCount: Number(result.lowStockCount),
        outOfStockCount: Number(result.outOfStockCount),
      };
    } catch (error) {
      handleError(error);
    }
  }

  public async stockIncrease(dto: StockIncreaseRequestDto[], key: keyof StockEntity): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(StockEntity);

        for (const item of dto) {
          const result = await repository.increment(
            {
              warehouseId: item.warehouseId,
              productId: item.productId,
              status: true,
            },
            key,
            item.quantity,
          );

          if (!result.affected) {
            throw new NotFoundException('Stock not found');
          } 
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateStockPostingStatus<
    I extends {
      productId: string;
      quantity: number;
    },
    T extends {
      id: string;
      warehouseId: string;
      status: StockStatusEnum;
      postedById: string;
      items: I[];
    }
  >(
    repo: Repository<T>,
    id: string,
    status: StockStatusEnum,
    postingById: string,
    key: keyof StockEntity
  ): Promise<void> {
    const entity = await repo.findOne({
      where: {
        id,
        status: Not(StockStatusEnum.CANCELLED),
      } as FindOptionsWhere<T>,
      relations: {
        items: true,
      } as FindOptionsRelations<T>,
    });

    if (!entity) {
      throw new NotFoundException('Stock document not found');
    }

    if (status === StockStatusEnum.POSTED) {
      if (!entity.items?.length) {
        throw new BadRequestException(
          'Stock document must contain at least one item',
        );
      }

      const stockItems: StockIncreaseRequestDto[] = entity.items.map(
        ({ productId, quantity }) => ({
          warehouseId: entity.warehouseId,
          productId,
          quantity: Number(quantity),
        }),
      );

      await this.stockIncrease(stockItems, key);
    }

    entity.status = status;
    entity.postedById = postingById;

    await repo.save(entity);

  }
}
