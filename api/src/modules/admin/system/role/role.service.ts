import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { RoleResponseDto } from './dto/role-response.dto';
import { handleError } from '@/common/utils/handle-error.util';
import { PermissionEntity } from '../permission/entities/permission.entity';
import { RoleMapper } from './role.mapper';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { RoleSelectOptionResponseDto } from './dto/role-select-option-response.dto';

@Injectable()
export class RoleService extends BasePaginationService<RoleEntity, RoleResponseDto> {
  protected SEARCHABLE_COLUMNS = ['nameEn', 'nameKh'];
  protected RELATIONSHIP_FIELDS = ['permissions'];
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<RoleEntity> {
    return this.roleRepository;
  }

  protected getMapperResponseEntityField(
    entity: RoleEntity,
  ): Promise<RoleResponseDto> {
    return RoleMapper.toDto(entity);
  }

  public async create(dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    try {
      const permissionIds = [...new Set(dto.permissions)];

      const permissions = await this.permissionRepository.find({
        where: {
          id: In(permissionIds),
        },
      });

      if (permissions.length !== permissionIds.length) {
        const foundIds = new Set(permissions.map((p) => p.id));

        const invalidIds = permissionIds.filter((id) => !foundIds.has(id));

        throw new BadRequestException({
          message: 'One or more permissions do not exist',
          invalidPermissionIds: invalidIds,
        });
      }


      let entity = RoleMapper.toCreateEntity(dto);

      entity.permissions = Promise.resolve(permissions);

      entity = await this.roleRepository.save(entity);

      return RoleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(): Promise<RoleSelectOptionResponseDto[]> {
    try {
      const entities = await this.roleRepository.find();
      const items = Promise.all(
        entities.map((item) => RoleMapper.toSelectOptionDto(item)),
      );
      return items;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<RoleResponseDto> {
    try {
      const entity = await this.roleRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          permissions: true,
        },
      });
      if (!entity) throw new NotFoundException('Role not found');
      return RoleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: string,
    dto: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    try {
      let entity = await this.roleRepository.findOne({
        where: { id },
        relations: { permissions: true },
      });

      if (!entity) throw new NotFoundException('Role not found');

      // Omitted permission IDs preserve the current assignments.
      if (dto.permissions != null) {
        const permissionIds = [...new Set(dto.permissions)];
        const permissions = await this.permissionRepository.find({
          where: { id: In(permissionIds) },
        });
        const foundIds = new Set(permissions.map((permission) => permission.id));
        const invalidPermissionIds = permissionIds.filter((id) => !foundIds.has(id));

        if (invalidPermissionIds.length > 0) {
          throw new BadRequestException({
            message: 'One or more permissions do not exist',
            invalidPermissionIds,
          });
        }

        entity.permissions = Promise.resolve(permissions);
      }

      entity = RoleMapper.toUpdateEntity(entity, dto);
      entity = await this.roleRepository.save(entity);

      return await RoleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.roleRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Role not found');
      await this.roleRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
