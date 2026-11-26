import { WarehouseMapper } from "../../master-data/warehouse/warehouse.mapper";
import { UserMapper } from "../../system/user/user.mapper";
import { CreateStockReceiptRequestDto } from "./dto/create-stock-receipt-request.dto";
import { StockReceiptResponseDto } from "./dto/stock-receipt-response.dto";
import { StockReceiptSelectOptionResponseDto } from "./dto/stock-receipt-select-option-response.dto";
import { UpdateStockReceiptRequestDto } from "./dto/update-stock-receipt-request.dto";
import { StockReceiptItemEntity } from "./entities/stock-receipt-item.entity";
import { StockReceiptEntity, StockStatusEnum } from "./entities/stock-receipt.entity";
import { StockReceiptItemMapper } from "./stock-receipt-item.mapper";

export class StockReceiptMapper {
    public static async toDto(entity: StockReceiptEntity): Promise<StockReceiptResponseDto> {
        const dto = new StockReceiptResponseDto();

        dto.id = entity.id;
        dto.documentNumber = entity.documentNumber;
        dto.warehouseId = entity.warehouseId;
        dto.receiptDate = entity.receiptDate;
        dto.referenceNo = entity.referenceNo;
        dto.description = entity.description;
        dto.status = entity.status;
        dto.totalQuantity = entity.totalQuantity;
        dto.createdById = entity.createdById;
        dto.postedById = entity.postedById;
        dto.postedAt = entity.postedAt;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;
        dto.attachments = entity.attachments ? [...entity.attachments] : [];

        if (entity.warehouse) {
            dto.warehouse = await WarehouseMapper.toDto(entity.warehouse);
        }

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        if (entity.postedBy) {
            dto.postedBy = await UserMapper.toDto(entity.postedBy);
        }

        if (entity.items && entity.items.length > 0) {
            dto.items = await Promise.all(
                entity.items.map((item) => StockReceiptItemMapper.toDto(item)),
            );
        } 

        return dto;
    }

    public static async toSelectOptionDto(entity: StockReceiptEntity): Promise<StockReceiptSelectOptionResponseDto> {
        const dto = new StockReceiptSelectOptionResponseDto();

        dto.id = entity.id;
        dto.documentNumber = entity.documentNumber;
        dto.status = entity.status;

        return dto;
    }

    public static toCreateEntity(dto: CreateStockReceiptRequestDto): StockReceiptEntity {
        const entity = new StockReceiptEntity();

        entity.documentNumber = dto.documentNumber;
        entity.warehouseId = dto.warehouseId;
        entity.receiptDate = dto.receiptDate;
        entity.referenceNo = dto.referenceNo;
        entity.description = dto.description;
        entity.status = StockStatusEnum.DRAFT;
        entity.totalQuantity = dto.totalQuantity;
        entity.attachments = dto.attachments ? [...dto.attachments] : [];
        entity.createdById = dto.createdById;
        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                const itemEntity = StockReceiptItemMapper.toCreateEntity(itemDto);
                return itemEntity;
            });
        }

        return entity;

    }

    public static toUpdateEntity(entity: StockReceiptEntity, dto: UpdateStockReceiptRequestDto): StockReceiptEntity {
        entity.documentNumber = dto.documentNumber;
        entity.warehouseId = dto.warehouseId;
        entity.receiptDate = dto.receiptDate;
        entity.referenceNo = dto.referenceNo;
        entity.description = dto.description;
        entity.status = dto.status;
        entity.totalQuantity = dto.totalQuantity;
        entity.attachments = dto.attachments ? [...dto.attachments] : entity.attachments;

        if (dto.items && dto.items.length > 0) {
            entity.items = dto.items.map((itemDto) => {
                let itemEntity: StockReceiptItemEntity | null = null;
                if (itemDto.id) {
                    itemEntity = StockReceiptItemMapper.toUpdateEntity(
                        new StockReceiptItemEntity({ id: itemDto.id }),
                        itemDto,
                    );
                } else {
                    itemEntity = StockReceiptItemMapper.toCreateEntity(itemDto);
                }
                itemEntity.stockReceipt = entity;
                return itemEntity;
            });
        }

        return entity;
    }
}