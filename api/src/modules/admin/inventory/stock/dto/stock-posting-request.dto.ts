import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { StockStatusEnum } from "../../stock-receipt/entities/stock-receipt.entity";

export class StockPostingRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(StockStatusEnum)
    status: StockStatusEnum;

    @ApiHideProperty()
    postedById: string;
}