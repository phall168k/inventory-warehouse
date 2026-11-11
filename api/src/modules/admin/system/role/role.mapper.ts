import { PermissionEntity } from "../permission/entities/permission.entity";
import { PermissionMapper } from "../permission/permission.mapper";
import { CreateRoleRequestDto } from "./dto/create-role-request.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import { RoleSelectOptionResponseDto } from "./dto/role-select-option-response.dto";
import { UpdateRoleRequestDto } from "./dto/update-role-request.dto";
import { RoleEntity } from "./entities/role.entity";

export class RoleMapper {
    public static async toDto(entity: RoleEntity): Promise<RoleResponseDto> {
        const dto = new RoleResponseDto();

        dto.id = entity.id;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        
        if (entity.permissions && (await entity.permissions).length > 0) {
            dto.permissions = await Promise.all(
                (await entity.permissions).map((permission) => PermissionMapper.toDto(permission)),
            );
        }

        return dto;
    }

    public static async toSelectOptionDto(entity: RoleEntity): Promise<RoleSelectOptionResponseDto> {
        const dto = new RoleSelectOptionResponseDto();

        dto.id = entity.id;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;

        return dto;
    }

    public static toCreateEntity(dto: CreateRoleRequestDto): RoleEntity {
        const entity = new RoleEntity();

        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;

        entity.permissions = Promise.resolve(
            dto.permissions.map((id) =>
                Object.assign(new PermissionEntity(), { id }),
            ),
        );

        return entity;
    }

    public static toUpdateEntity(entity: RoleEntity, dto: UpdateRoleRequestDto): RoleEntity {
        if (dto.nameEn != null) entity.nameEn = dto.nameEn;
        if (dto.nameKh != null) entity.nameKh = dto.nameKh;

        return entity;
    }
}