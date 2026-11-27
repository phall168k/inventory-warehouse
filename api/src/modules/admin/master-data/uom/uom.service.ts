import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { UomEntity } from './entities/uom.entity';
import { UomResponseDto } from './dto/uom-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UomMapper } from './uom.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { UomSelectOptionDto } from './dto/uom-select-option-response.dto';
import { RedisService } from '@/redis/redis.service';
import { RedisCacheKeys } from '@/redis/constants/redis-cache-keys.constants';

@Injectable()
export class UomService extends BasePaginationService<UomEntity, UomResponseDto>{
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSHIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(UomEntity)
    private readonly uomRepository: Repository<UomEntity>,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  protected get repository(): Repository<UomEntity> {
    return this.uomRepository;
  }

  protected getMapperResponseEntityField(entity: UomEntity): Promise<UomResponseDto> {
    return UomMapper.toDto(entity);
  }

  public async create(dto: CreateUomRequestDto): Promise<UomResponseDto> {
    try {
      let entity = UomMapper.toCreateEntity(dto);
      entity = await this.uomRepository.save(entity);
      return UomMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(): Promise<UomSelectOptionDto[]> {
    try {
      const cacheKey = RedisCacheKeys.UOM.SELECT;
      const cachedUoms = await this.redisService.get<UomSelectOptionDto[]>(cacheKey);
      if (cachedUoms !== null) return cachedUoms;
      const entities = await this.uomRepository.find({
        where: {
          status: true,
        },
      });
      const itemsMapped = await Promise.all(
        entities.map((item) => UomMapper.toSelectOptionDto(item)),
      );
      await this.redisService.set<UomSelectOptionDto[]>(cacheKey, itemsMapped);
      return itemsMapped;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<UomResponseDto> {
    try {
      const cacheKey = RedisCacheKeys.UOM.DETAIL(id);
      const cachedUom = await this.redisService.get<UomResponseDto>(cacheKey);
      if (cachedUom) return cachedUom;
      const entity = await this.uomRepository.findOne({
        where: { id },
        relations: {
          createdBy: true,
        },
      });
      if (!entity) throw new NotFoundException('Uom not found');
      const mappedUom = await UomMapper.toDto(entity);
      await this.redisService.set<UomResponseDto>(cacheKey, mappedUom);
      return mappedUom;
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: string, dto: UpdateUomRequestDto): Promise<UomResponseDto> {
    try {
      let entity = await this.uomRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Uom not found');
      entity = UomMapper.toUpdateEntity(entity, dto);
      entity = await this.uomRepository.save(entity);
      await this.redisService.del(RedisCacheKeys.UOM.DETAIL(id), RedisCacheKeys.UOM.SELECT);
      return UomMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.uomRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Uom not found'); 
      await this.uomRepository.softDelete(id);
      await this.redisService.del(RedisCacheKeys.UOM.DETAIL(id), RedisCacheKeys.UOM.SELECT);
    } catch (error) {
      handleError(error);
    }
  }
}
