import { UserMapper } from "../../system/user/user.mapper";
import { CreateWarehouseRequestDto } from "./dto/create-warehouse-request.dto";
import { UpdateWarehouseRequestDto } from "./dto/update-warehouse-request.dto";
import { WarehouseResponseDto } from "./dto/warehouse-response.dto";
import { WarehouseSelectOptionResponseDto } from "./dto/warehouse-select-option-response.dto";
import { WarehouseEntity } from "./entities/warehouse.entity";

export class WarehouseMapper {
    public static async toDto(entity: WarehouseEntity): Promise<WarehouseResponseDto> {
        const dto = new WarehouseResponseDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.managerId = entity.managerId;
        dto.address = entity.address;
        dto.contactNumber = entity.contactNumber;
        dto.logo = entity.logo;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.manager) {
            dto.manager = await UserMapper.toDto(entity.manager);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static async toSelectOptionDto(entity: WarehouseEntity): Promise<WarehouseSelectOptionResponseDto> {
        const dto = new WarehouseSelectOptionResponseDto();

        dto.id = entity.id;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;

        return dto;
    }

    public static toCreateEntity(dto: CreateWarehouseRequestDto): WarehouseEntity {
        const entity = new WarehouseEntity();

        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.managerId = dto.managerId;
        entity.address = dto.address;
        entity.contactNumber = dto.contactNumber;
        entity.logo = dto.logo ?? null;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: WarehouseEntity, dto: UpdateWarehouseRequestDto): WarehouseEntity {
        entity.code = dto.code;
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.managerId = dto.managerId;
        entity.address = dto.address;
        entity.contactNumber = dto.contactNumber;
        entity.logo = dto.logo;

        return entity;
    }
}