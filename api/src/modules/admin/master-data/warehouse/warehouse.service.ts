import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateWarehouseRequestDto } from './dto/create-warehouse-request.dto';
import { UpdateWarehouseRequestDto } from './dto/update-warehouse-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { WarehouseEntity } from './entities/warehouse.entity';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseMapper } from './warehouse.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { WarehouseSelectOptionResponseDto } from './dto/warehouse-select-option-response.dto';
import { UserResponseDto } from '../../system/user/dto/user-response.dto';

@Injectable()
export class WarehouseService extends BasePaginationService<WarehouseEntity, WarehouseResponseDto>{
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'manager.nameEn', 'manager.nameKh', 'contactNumber', 'address'];
  protected RELATIONSHIP_FIELDS = ['manager', 'createdBy'];

  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<WarehouseEntity> {
    return this.warehouseRepository;
  }

  protected getMapperResponseEntityField(entity: WarehouseEntity): Promise<WarehouseResponseDto> {
    return WarehouseMapper.toDto(entity);
  }
  
  public async create(dto: CreateWarehouseRequestDto): Promise<WarehouseResponseDto> {
    try {
      let entity = WarehouseMapper.toCreateEntity(dto);
      entity = await this.warehouseRepository.save(entity);
      return WarehouseMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(user: UserResponseDto): Promise<WarehouseSelectOptionResponseDto[]> {
    try {
      if (!user?.id || !user.isActive) {
        throw new UnauthorizedException();
      }

      const query = this.warehouseRepository
        .createQueryBuilder('warehouse');

      if (user.isSuperUser !== true) {
        query.innerJoin('warehouse.users', 'assignedUser', 'assignedUser.id = :userId', {
          userId: user.id,
        });
      }

      const entities = await query.getMany();
      return await Promise.all(
        entities.map((item) => WarehouseMapper.toSelectOptionDto(item)),
      );
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<WarehouseResponseDto> {
    try {
      const entity = await this.warehouseRepository.findOne({
        where: { id },
        relations: {
          manager: true,
          createdBy: true,
        },
      });
      if (!entity) throw new NotFoundException('Warehouse not found');
      return WarehouseMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: string, dto: UpdateWarehouseRequestDto): Promise<WarehouseResponseDto> {
    try {
      let entity = await this.warehouseRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Warehouse not found');

      entity = WarehouseMapper.toUpdateEntity(entity, dto);
      entity = await this.warehouseRepository.save(entity);
      return WarehouseMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.warehouseRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Warehouse not found');
      await this.warehouseRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
