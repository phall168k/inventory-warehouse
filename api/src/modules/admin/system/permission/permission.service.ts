import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { IsNull, Repository } from 'typeorm';
import { PermissionSelectOptionResponseDto } from './dto/permission-response.dto';
import { PermissionMapper } from './permission.mapper';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  public async findAllForSelectOptions(): Promise<PermissionSelectOptionResponseDto[]>{
    try {
      const entities = await this.permissionRepository.find({
        where: {
          parentId: IsNull(),
        },
        relations: {
          children: true,
        },
      });

      return entities.map((item) =>
        PermissionMapper.toSelectOptionsDto(item),
      );
    } catch (error) {

    }
  }
}
