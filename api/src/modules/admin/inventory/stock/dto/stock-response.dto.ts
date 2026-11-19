import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { WarehouseResponseDto } from "@/modules/admin/master-data/warehouse/dto/warehouse-response.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class StockResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;

    @ApiProperty({
        type: () => ProductResponseDto,
    })
    product: ProductResponseDto;

    @ApiProperty()
    warehouseId: string;

    @ApiProperty()
    warehouse: WarehouseResponseDto;

    @ApiProperty()
    minStock: number;

    @ApiProperty()
    receiveQuantity: number;

    @ApiProperty()
    issueQuantity: number;

    @ApiProperty()
    transferQuantity: number;

    @ApiProperty()
    adjustmentQuantity: number;

    @ApiProperty()
    stockQauntity: number;

    @ApiProperty()
    createdById: string;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    status: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}