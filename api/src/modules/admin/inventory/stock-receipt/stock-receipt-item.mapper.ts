import { ProductMapper } from "../../master-data/product/product.mapper";
import { CreateStockReceiptItemRequestDto } from "./dto/create-stock-receipt-item-request.dto";
import { StockReceiptItemResponseDto } from "./dto/stock-receipt-item-response.dto";
import { UpdateStockReceiptItemRequestDto } from "./dto/update-stock-receipt-item-request.dto";
import { StockReceiptItemEntity } from "./entities/stock-receipt-item.entity";

export class StockReceiptItemMapper {
    public static async toDto(entity: StockReceiptItemEntity): Promise<StockReceiptItemResponseDto> {
        const dto = new StockReceiptItemResponseDto();

        dto.id = entity.id;
        dto.stockReceiptId = entity.stockReceiptId;
        dto.productId = entity.productId;
        dto.quantity = entity.quantity;
        dto.unitCost = entity.unitCost;
        dto.note = entity.note;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.product) {
            dto.product = await ProductMapper.toDto(entity.product);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateStockReceiptItemRequestDto): StockReceiptItemEntity {
        const entity = new StockReceiptItemEntity();

        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.unitCost = dto.unitCost;
        entity.note = dto.note;

        return entity;
    }

    public static toUpdateEntity(entity: StockReceiptItemEntity, dto: UpdateStockReceiptItemRequestDto): StockReceiptItemEntity {
        entity.productId = dto.productId;
        entity.quantity = dto.quantity;
        entity.unitCost = dto.unitCost;
        entity.note = dto.note;

        return entity;
    }
}