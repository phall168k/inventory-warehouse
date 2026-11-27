import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { ProductEntity } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductMapper } from './product.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { ProductSelectOptionDto } from './dto/product-select-option-response.dto';
import { StockEntity } from '../../inventory/stock/entities/stock.entity';
import { RedisService } from '@/redis/redis.service';
import { RedisCacheKeys } from '@/redis/constants/redis-cache-keys.constants';

@Injectable()
export class ProductService extends BasePaginationService<
  ProductEntity,
  ProductResponseDto
> {
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSHIP_FIELDS = ['createdBy', 'category', 'uom'];

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  protected get repository(): Repository<ProductEntity> {
    return this.productRepository;
  }

  protected getMapperResponseEntityField(
    entity: ProductEntity,
  ): Promise<ProductResponseDto> {
    return ProductMapper.toDto(entity);
  }

  
public async create(
  dto: CreateProductDto,
): Promise<ProductResponseDto> {
  try {
    return await this.dataSource.transaction(
      async (manager) => {
        let entity = ProductMapper.toCreateEntity(dto);
        entity = await manager.save(
          ProductEntity,
          entity,
        );
        if (dto.warehouseIds?.length > 0) {
          const stocks = dto.warehouseIds.map(
            (warehouseId) =>
              manager.create(StockEntity, {
                productId: entity.id,
                warehouseId,
                minStock: dto.minStock ?? 0,
                receiveQuantity: dto.receiveQuantity ?? 0,
                issueQuantity: dto.issueQuantity ?? 0,
                transferQuantity: dto.transferQuantity ?? 0,
                adjustmentQuantity:
                  dto.adjustmentQuantity ?? 0,
                status: dto.status ?? true,
                createdById: dto.createdById,
              }),
          );

          await manager.save(StockEntity, stocks);
        }
        return await ProductMapper.toDto(entity);
      },
    );
  } catch (error) {
    handleError(error);
  }
}


  public async findAllForSelectOptions(): Promise<ProductSelectOptionDto[]> {
    try {
      const cacheKey = RedisCacheKeys.PRODUCT.SELECT;
      const cachedProducts = await this.redisService.get<ProductSelectOptionDto[]>(cacheKey);
      if (cachedProducts !== null) return cachedProducts;  
      const entities = await this.productRepository.find({
        where: {
          status: true,
        },
      });
      const itemsMapped = await Promise.all(
        entities.map((item) => ProductMapper.toSelectOptionDto(item)),
      );
      await this.redisService.set<ProductSelectOptionDto[]>(cacheKey, itemsMapped);
      return itemsMapped;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<ProductResponseDto> {
    try {
      const cacheKey = RedisCacheKeys.PRODUCT.DETAIL(id);
      const cachedProduct = await this.redisService.get<ProductResponseDto>(cacheKey);
      if (cachedProduct) return cachedProduct;
      const entity = await this.productRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
          category: true,
          uom: true,
          stocks: { warehouse: true },
        },
      });
      if (!entity) throw new NotFoundException('Product not found');
      const mappedProduct = await ProductMapper.toDto(entity);
      await this.redisService.set(cacheKey, mappedProduct);
      return mappedProduct;
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateProductRequestDto,
    updatedById?: string,
  ): Promise<ProductResponseDto> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        let entity = await manager.findOne(ProductEntity, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!entity) throw new NotFoundException('Product not found');
        entity = await manager.save(ProductEntity, ProductMapper.toUpdateEntity(entity, dto));

        if (dto.warehouseIds !== undefined) {
          const selected = new Set(dto.warehouseIds);
          const stocks = await manager.find(StockEntity, {
            where: { productId: id },
            withDeleted: true,
          });
          const existing = new Set(stocks.map((stock) => stock.warehouseId));
          for (const stock of stocks) {
            if (selected.has(stock.warehouseId) && stock.deletedAt) {
              await manager.restore(StockEntity, stock.id);
            } else if (!selected.has(stock.warehouseId) && !stock.deletedAt) {
              await manager.softDelete(StockEntity, stock.id);
            }
          }
          const newStocks = dto.warehouseIds
            .filter((warehouseId) => !existing.has(warehouseId))
            .map((warehouseId) => manager.create(StockEntity, {
              productId: id,
              warehouseId,
              minStock: 0,
              receiveQuantity: 0,
              issueQuantity: 0,
              transferQuantity: 0,
              adjustmentQuantity: 0,
              status: true,
              createdById: updatedById,
            }));
          if (newStocks.length) await manager.save(StockEntity, newStocks);
          entity.stocks = await manager.find(StockEntity, { where: { productId: id } });
        }
        await this.redisService.del(RedisCacheKeys.PRODUCT.DETAIL(id), RedisCacheKeys.PRODUCT.SELECT);
        return ProductMapper.toDto(entity);
      });
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.productRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Product not found');
      await this.productRepository.softDelete(id);
      await this.redisService.del(RedisCacheKeys.PRODUCT.DETAIL(id), RedisCacheKeys.PRODUCT.SELECT);
    } catch (error) {
      handleError(error);
    }
  }
}
