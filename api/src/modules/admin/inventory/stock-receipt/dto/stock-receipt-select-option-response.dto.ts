import { ApiProperty } from "@nestjs/swagger";
import { StockStatusEnum } from "../entities/stock-receipt.entity";

export class StockReceiptSelectOptionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    documentNumber: string;

    @ApiProperty()
    status: StockStatusEnum;
}