import { ProductResponseDto } from "@/modules/admin/master-data/product/dto/product-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { StockReceiptResponseDto } from "./stock-receipt-response.dto";

export class StockReceiptItemResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    stockReceiptId: string;

    @ApiProperty({
        type: () => StockReceiptResponseDto,
    })
    stockReceipt: StockReceiptResponseDto;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    product: ProductResponseDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    unitCost: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}