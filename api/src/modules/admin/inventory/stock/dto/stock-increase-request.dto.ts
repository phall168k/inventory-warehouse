import { ApiProperty } from "@nestjs/swagger";
import { 
    IsNotEmpty, 
    IsUUID 
} from "class-validator";

export class StockIncreaseRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    warehouseId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;
}