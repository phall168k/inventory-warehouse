import { PermissionSelectOptionResponseDto } from "./dto/permission-response.dto";
import { PermissionEntity } from "./entities/permission.entity";

export class PermissionMapper {
    public static toSelectOptionsDto(entity: PermissionEntity): PermissionSelectOptionResponseDto {
        const dto = new PermissionSelectOptionResponseDto();

        dto.id = entity.id;
        dto.name = entity.name;
        dto.children = (entity.children ?? []).map((child) =>
            PermissionMapper.toSelectOptionsDto(child),
        );

        return dto;
    }
}