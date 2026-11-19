import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class StockSelectOptionFilterReuestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    warehouseId: string;

    @ApiProperty()
    @IsOptional()
    @IsUUID()
    categoryId?: string;
}