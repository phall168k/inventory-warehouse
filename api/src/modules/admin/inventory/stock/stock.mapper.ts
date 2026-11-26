import { ProductMapper } from "../../master-data/product/product.mapper";
import { WarehouseMapper } from "../../master-data/warehouse/warehouse.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockRequestDto } from "./dto/create-stock-request.dto";
import { StockResponseDto } from "./dto/stock-response.dto";
import { StockSelectOptionResponseDto } from "./dto/stock-select-option-response.dto";
import { UpdateStockRequestDto } from "./dto/update-stock-request.dto";
import { StockEntity } from "./entities/stock.entity";

export class StockMapper {
    public static async toDto(entity: StockEntity): Promise<StockResponseDto> {
        const dto = new StockResponseDto();

        dto.id = entity.id;
        dto.productId = entity.productId;
        dto.warehouseId = entity.warehouseId;
        dto.minStock = entity.minStock;
        dto.receiveQuantity = entity.receiveQuantity;
        dto.issueQuantity = entity.issueQuantity;
        dto.transferQuantity = entity.transferQuantity;
        dto.adjustmentQuantity = entity.adjustmentQuantity;
        dto.stockQauntity = ((entity.receiveQuantity + entity.transferQuantity + entity.adjustmentQuantity) - entity.issueQuantity);
        dto.createdById = entity.createdById;
        dto.status = entity.status;

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

    public static async toSelectOptionDto(entity: StockEntity): Promise<StockSelectOptionResponseDto> {
        const dto = new StockSelectOptionResponseDto();
        
        dto.id = entity.productId;
        dto.code = entity.product.code;
        dto.nameEn = entity.product.nameEn;
        dto.nameKh = entity.product.nameKh;
        
        return dto;
    }

    public static toCreateEntity(dto: CreateStockRequestDto): StockEntity {
        const entity = new StockEntity();

        entity.productId = dto.productId;
        entity.warehouseId = dto.warehouseId;
        entity.minStock = dto.minStock;
        entity.receiveQuantity = dto.receiveQuantity;
        entity.issueQuantity = dto.issueQuantity;
        entity.transferQuantity = dto.transferQuantity;
        entity.adjustmentQuantity = dto.adjustmentQuantity;
        entity.status = dto.status;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: StockEntity, dto: UpdateStockRequestDto): StockEntity {
        entity.productId = dto.productId;
        entity.warehouseId = dto.warehouseId;
        entity.minStock = dto.minStock;
        entity.receiveQuantity = dto.receiveQuantity;
        entity.issueQuantity = dto.issueQuantity;
        entity.transferQuantity = dto.transferQuantity;
        entity.adjustmentQuantity = dto.adjustmentQuantity;
        entity.status = dto.status;

        return entity;
    }
}
