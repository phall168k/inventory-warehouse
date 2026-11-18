import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { ProductEntity } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMapper } from './product.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { ProductSelectOptionDto } from './dto/product-select-option-response.dto';

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

  public async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    try {
      let entity = ProductMapper.toCreateEntity(dto);
      entity = await this.productRepository.save(entity);
      return ProductMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(): Promise<ProductSelectOptionDto[]> {
    try {
      const entities = await this.productRepository.find({
        where: {
          status: true,
        },
      });
      const itemsMapped = Promise.all(
        entities.map((item) => ProductMapper.toSelectOptionDto(item)),
      );
      return itemsMapped;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<ProductResponseDto> {
    try {
      const entity = await this.productRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
          category: true,
          uom: true,
        },
      });
      if (!entity) throw new NotFoundException('Product not found');
      return ProductMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      let entity = await this.productRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Product not found');
      entity = ProductMapper.toUpdateEntity(entity, dto);
      entity = await this.productRepository.save(entity);
      return ProductMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.productRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Product not found');
      await this.productRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
