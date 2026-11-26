import { WarehouseResponseDto } from "@/modules/admin/master-data/warehouse/dto/warehouse-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockStatusEnum } from "../entities/stock-receipt.entity";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { AttachmentDto } from "@/common/dto/attachment.dto";
import { StockReceiptItemResponseDto } from "./stock-receipt-item-response.dto";

export class StockReceiptResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    documentNumber: string;

    @ApiProperty()
    warehouseId: string;

    @ApiProperty()
    warehouse: WarehouseResponseDto;

    @ApiProperty()
    receiptDate: Date;

    @ApiProperty()
    referenceNo: string;
    
    @ApiProperty()
    description: string;

    @ApiProperty()
    status: StockStatusEnum;

    @ApiProperty()
    totalQuantity: number;

    @ApiProperty()
    createdById: string;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    postedById: string;

    @ApiProperty()
    postedBy: UserResponseDto;

    @ApiProperty()
    postedAt: Date;

    @ApiProperty()
    attachments: AttachmentDto[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty({
        type: () => [StockReceiptItemResponseDto]
    })
    items: StockReceiptItemResponseDto[];
}