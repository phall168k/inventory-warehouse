import { Injectable, NotFoundException } from '@nestjs/common';
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
import { UserSelectOptionResponseDto } from './dto/user-select-option-response.dto';
import { PasswordHasher } from '@nestjs/authentication';
import { RedisService } from '@/redis/redis.service';
import { RedisCacheKeys } from '@/redis/constants/redis-cache-keys.constants';
import { RedisCacheTTL } from '@/redis/constants/redis-cache-ttl.constants';

@Injectable()
export class UserService extends BasePaginationService<UserEntity, UserResponseDto>{
  protected SEARCHABLE_COLUMNS = ['nameEn', 'nameKh', 'username', 'email'];
  protected RELATIONSHIP_FIELDS = ['roles.permissions'];

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
    private readonly passwordHasher: PasswordHasher,
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
        password: await this.passwordHasher.hash(dto.password),
      });
      entity = await this.userRepository.save(entity);
      await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'roles')
        .of(entity)
        .add(dto.roles);
      await this.userRepository
        .createQueryBuilder()
        .relation(UserEntity, 'warehouses')
        .of(entity)
        .add(dto.warehouses);
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOptions(): Promise<UserSelectOptionResponseDto[]> {
    try {
      const cacheKey = RedisCacheKeys.USER.SELECT;

      const cachedUsers = await this.redisService.get<UserSelectOptionResponseDto[]>(cacheKey);

      if (cachedUsers !== null) return cachedUsers;

      const entities = await this.userRepository.find({
        where: {
          isActive: true,
        },
      });
      const mappedUsers = await Promise.all(
        entities.map((item) => UserMapper.toSelectOptionDto(item)),
      );

      await this.redisService.set<UserSelectOptionResponseDto[]>(cacheKey, mappedUsers, RedisCacheTTL.THIRTY_MINUTES);

      return mappedUsers;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<UserResponseDto> {
    try {
      const cacheKey = RedisCacheKeys.USER.DETAIL(id);
      const cache = await this.redisService.get<UserResponseDto>(cacheKey);
      if (cache) {
        return cache;
      }
      const entity = await this.userRepository.findOne({
        where: { id },
        relations: {
          roles: {
            permissions: true,
          },
        },
      });
      if (!entity) throw new NotFoundException('User not found');
      const mappedUser = await UserMapper.toDtoWithRelationship(entity);
      await this.redisService.set<UserResponseDto>(cacheKey, mappedUser);
      return mappedUser;
    } catch (error) {
      handleError(error);
    }
  }

  public async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      select: {
        id: true,
        nameEn: true,
        nameKh: true,
        username: true,
        email: true,
        password: true,
        isSuperUser: true,
        profile: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        roles: {
          permissions: true,
        },
      },
      where: { 
        username,
        isActive: true, 
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
  }

  public async update(id: string, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException();
      entity = UserMapper.toUpdateEntity(entity, dto);
      entity =  await this.userRepository.save(entity);
      await this.redisService.del(RedisCacheKeys.USER.DETAIL(id));
      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.userRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('User not found');
      await this.redisService.del(RedisCacheKeys.USER.DETAIL(id));
      await this.userRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }
}
