import { UserMapper } from '../../system/user/user.mapper';
import { CategoryMapper } from '../category/category.mapper';
import { UomMapper } from '../uom/uom.mapper';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductSelectOptionDto } from './dto/product-select-option-response.dto';
import { CreateProductDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { ProductEntity } from './entities/product.entity';
import { StockMapper } from '../../inventory/stock/stock.mapper';

export class ProductMapper {
  public static async toDto(entity: ProductEntity): Promise<ProductResponseDto> {
    const dto = new ProductResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.categoryId = entity.categoryId;
    dto.uomId = entity.uomId;
    dto.status = entity.status;
    dto.thumbnail = entity.thumbnail;
    dto.createdById = entity.createdById;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.createdBy) {
      dto.createdBy = await UserMapper.toDto(entity.createdBy);
    }
    if (entity.category) {
      dto.category = await CategoryMapper.toDto(entity.category);
    }
    if (entity.uom) {
      dto.uom = await UomMapper.toDto(entity.uom);
    }

    if (entity.stocks && entity.stocks.length > 0) {
      dto.stocks = await Promise.all(
        entity.stocks.map((item) => StockMapper.toDto(item)),
      );
    }
    return dto;
  }

  public static async toSelectOptionDto(
    entity: ProductEntity,
  ): Promise<ProductSelectOptionDto> {
    const dto = new ProductSelectOptionDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;

    return dto;
  }

  static toCreateEntity(dto: CreateProductDto): ProductEntity {
    const entity = new ProductEntity();
  
    entity.code = dto.code;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;
    entity.categoryId = dto.categoryId;
    entity.uomId = dto.uomId;
    entity.thumbnail = dto.thumbnail ?? null;
    entity.status = dto.status ?? true;
    entity.createdById = dto.createdById;

    return entity;
  }

  static toUpdateEntity(
    entity: ProductEntity,
    dto: UpdateProductRequestDto,
  ): ProductEntity {
    
    entity.code = dto.code;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;
    entity.categoryId = dto.categoryId;
    entity.uomId = dto.uomId;
    entity.thumbnail = dto.thumbnail ?? null;
    entity.status = dto.status ?? true;

    return entity;
  }
}
