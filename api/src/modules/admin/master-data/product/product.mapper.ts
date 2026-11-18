import { UserMapper } from '../../system/user/user.mapper';
import { CategoryMapper } from '../category/category.mapper';
import { UomMapper } from '../uom/uom.mapper';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductSelectOptionDto } from './dto/product-select-option-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

export class ProductMapper {
  static async toDto(entity: ProductEntity): Promise<ProductResponseDto> {
    const dto = Object.assign(new ProductResponseDto(), {
      id: entity.id,
      code: entity.code,
      nameEn: entity.nameEn,
      nameKh: entity.nameKh,
      categoryId: entity.categoryId,
      uomId: entity.uomId,
      status: entity.status,
      thumbnail: entity.thumbnail,
      createdById: entity.createdById,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
    if (entity.createdBy)
      dto.createdBy = await UserMapper.toDto(entity.createdBy);
    if (entity.category)
      dto.category = await CategoryMapper.toDto(entity.category);
    if (entity.uom) dto.uom = await UomMapper.toDto(entity.uom);
    return dto;
  }

  static async toSelectOptionDto(
    entity: ProductEntity,
  ): Promise<ProductSelectOptionDto> {
    return Object.assign(new ProductSelectOptionDto(), {
      id: entity.id,
      code: entity.code,
      nameEn: entity.nameEn,
      nameKh: entity.nameKh,
    });
  }

  static toCreateEntity(dto: CreateProductDto): ProductEntity {
    const entity = this.toUpdateEntity(new ProductEntity(), dto);
    entity.status = dto.status ?? true;
    entity.createdById = dto.createdById;
    return entity;
  }

  static toUpdateEntity(
    entity: ProductEntity,
    dto: UpdateProductDto,
  ): ProductEntity {
    for (const key of [
      'code',
      'nameEn',
      'nameKh',
      'categoryId',
      'uomId',
      'status',
      'thumbnail',
    ] as const) {
      if (dto[key] !== undefined) Object.assign(entity, { [key]: dto[key] });
    }
    return entity;
  }
}
