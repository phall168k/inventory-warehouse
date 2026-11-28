import { 
    ApiHideProperty, 
    ApiProperty 
} from "@nestjs/swagger";
import { 
    IsEnum, 
    IsNotEmpty, 
    IsString, 
    IsUUID 
} from "class-validator";
import { StockMovementTypeEnum } from "../entities/stock-movement.entity";

export class CreateStockMovementRequestDto {
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
    @IsEnum(StockMovementTypeEnum)
    movementType: StockMovementTypeEnum;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    referenceType: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    referenceId: string;

    @ApiProperty()
    @IsNotEmpty()
    quantityChange: number;

    @ApiHideProperty()
    createdById: string;
}
