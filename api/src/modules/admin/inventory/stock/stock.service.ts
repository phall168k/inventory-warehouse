import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { StockEntity } from './entities/stock.entity';
import { StockResponseDto } from './dto/stock-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMapper } from './stock.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { StockSelectOptionResponseDto } from './dto/stock-select-option-response.dto';
import { StockSelectOptionFilterReuestDto } from './dto/stock-select-option-filter-request.dto';
import { StockSummaryResponseDto } from './dto/stock-summary-response.dto';

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
        .leftJoin('stock.product', 'product')
        .where('stock.warehouseId = :warehouseId', {
          warehouseId: dto.warehouseId,
        })
        .andWhere('stock.status =: status', {
          status: true
        });
        if (dto.categoryId) {
          query.andWhere('stock.product.categoryId = :caategoryId', {
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
}
