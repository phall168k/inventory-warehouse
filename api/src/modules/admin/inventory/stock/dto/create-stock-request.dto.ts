import { 
    ApiHideProperty, 
    ApiProperty 
} from "@nestjs/swagger";
import { 
    IsBoolean, 
    IsNotEmpty, 
    IsUUID 
} from "class-validator";

export class CreateStockRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    warehouseId: string;

    @ApiProperty()
    @IsNotEmpty()
    minStock: number;

    @ApiProperty()
    @IsNotEmpty()
    receiveQuantity: number;

    @ApiProperty()
    @IsNotEmpty()
    issueQuantity: number;

    @ApiProperty()
    @IsNotEmpty()
    transferQuantity: number;

    @ApiProperty()
    @IsNotEmpty()
    adjustmentQuantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;

    @ApiHideProperty()
    createdById: string;
}
