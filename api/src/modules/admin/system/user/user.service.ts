import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { UserEntity } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { UserMapper } from './user.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { PasswordHash } from '@/common/utils/password-hash.util';
import { UserSelectOptionResponseDto } from './dto/user-select-option-response.dto';

@Injectable()
export class UserService extends BasePaginationService<UserEntity, UserResponseDto>{
  protected SEARCHABLE_COLUMNS = ['nameEn', 'nameKh', 'username', 'email'];
  protected RELATIONSHIP_FIELDS = ['roles.permissions'];

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<UserEntity> {
    return this.userRepository;
  }

  protected getMapperResponseEntityField(entity: UserEntity): Promise<UserResponseDto> {
    return UserMapper.toDto(entity);
  }

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = await UserMapper.toCreateEntity({
        ...dto,
        password: await PasswordHash.hash(dto.password),
      });
      entity = await this.userRepository.save(entity);
      await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'roles')
        .of(entity)
        .add(dto.roles);
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(): Promise<UserSelectOptionResponseDto[]> {
    try {
      const entities = await this.userRepository.find();

      const mappedUsers = Promise.all(
        entities.map((item) => UserMapper.toSelectOptionDto(item)),
      );

      return mappedUsers;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: { id },
        relations: {
          roles: {
            permissions: true,
          },
        },
      });
      if (!entity) throw new NotFoundException('User not found');
      return await UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: string, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = UserMapper.toUpdateEntity(entity, dto);
      entity =  await this.userRepository.save(entity);
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('User not found');

      await this.userRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
