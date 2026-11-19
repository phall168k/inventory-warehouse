import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { WarehouseResponseDto } from "@/modules/admin/master-data/warehouse/dto/warehouse-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockMovementTypeEnum } from "../entities/stock-movement.entity";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";

export class StockMovementResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    warehouseId: string;

    @ApiProperty()
    warehouse: WarehouseResponseDto;

    @ApiProperty()
    movementType: StockMovementTypeEnum;

    @ApiProperty()
    referenceType: string;

    @ApiProperty()
    referenceId: string;

    @ApiProperty()
    quantityChange: number;

    @ApiProperty()
    balanceAfter: number;

    @ApiProperty()
    createdById: string;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}