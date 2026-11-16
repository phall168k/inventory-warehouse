import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { CategoryEntity } from './entities/category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryMapper } from './category.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { CategorySelectOptionDto } from './dto/category-select-option-response.dto';

@Injectable()
export class CategoryService extends BasePaginationService<CategoryEntity, CategoryResponseDto>{
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSHIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<CategoryEntity> {
    return this.categoryRepository;
  }

  protected getMapperResponseEntityField(entity: CategoryEntity): Promise<CategoryResponseDto> {
    return CategoryMapper.toDto(entity);
  }

  public async create(dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
    try {
      let entity = CategoryMapper.toCreateEntity(dto);
      entity = await this.categoryRepository.save(entity);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(): Promise<CategorySelectOptionDto[]> {
    try {
      const entities = await this.categoryRepository.find({
        where: {
          status: true,
        },
      });
      const itemsMapped = Promise.all(
        entities.map((item) => CategoryMapper.toSelectOptionDto(item)),
      );
      return itemsMapped;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<CategoryResponseDto> {
    try {
      const entity = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        },
      });
      if (!entity) throw new NotFoundException('Category not found');
      return CategoryMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: string, dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto> {
    try {
      let entity = await this.categoryRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Category not found');
      entity = CategoryMapper.toUpdateEntity(entity, dto);
      entity = await this.categoryRepository.save(entity);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.categoryRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Category not found'); 
      await this.categoryRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
