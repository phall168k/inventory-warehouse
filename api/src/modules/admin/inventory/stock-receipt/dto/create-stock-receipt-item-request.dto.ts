import { 
    ApiProperty, 
    ApiPropertyOptional 
} from "@nestjs/swagger";
import { 
    IsNotEmpty, 
    IsOptional, 
    IsPositive, 
    IsString, 
    IsUUID 
} from "class-validator";

export class CreateStockReceiptItemRequestDto {
    @ApiPropertyOptional()
    @IsOptional()
    id?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsPositive()
    unitCost: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;
}