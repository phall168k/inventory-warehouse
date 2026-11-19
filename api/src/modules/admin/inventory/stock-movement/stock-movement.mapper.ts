import { ProductMapper } from "../../master-data/product/product.mapper";
import { WarehouseMapper } from "../../master-data/warehouse/warehouse.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockMovementRequestDto } from "./dto/create-stock-movement-request.dto";
import { StockMovementResponseDto } from "./dto/stock-movement-response.dto";
import { StockMovementEntity } from "./entities/stock-movement.entity";

export class StockMovementMapper {
    public static async toDto(entity: StockMovementEntity): Promise<StockMovementResponseDto> {
        const dto = new StockMovementResponseDto();

        dto.id = entity.id;
        dto.productId = entity.productId;
        dto.warehouseId = entity.warehouseId;
        dto.movementType = entity.movementType;
        dto.referenceType = entity.referenceType;
        dto.referenceId = entity.referenceId;
        dto.quantityChange = entity.quantityChange;
        dto.balanceAfter = entity.balanceAfter;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        if (entity.warehouse) {
            dto.warehouse = await WarehouseMapper.toDto(entity.warehouse);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockMovementRequestDto): StockMovementEntity {
        const entity = new StockMovementEntity();

        entity.productId = dto.productId;
        entity.warehouseId = dto.warehouseId;
        entity.movementType = dto.movementType;
        entity.referenceType = dto.referenceType;
        entity.referenceId = dto.referenceId;
        entity.quantityChange = dto.quantityChange;
        entity.balanceAfter = dto.balanceAfter;
        entity.createdById = dto.createdById;

        return entity;
    }
}