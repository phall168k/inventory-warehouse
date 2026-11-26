import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { StockStatusEnum } from "../entities/stock-receipt.entity";
import { AttachmentDto } from "@/common/dto/attachment.dto";
import { CreateStockReceiptItemRequestDto } from "./create-stock-receipt-item-request.dto";
import { Type } from "class-transformer";

export class CreateStockReceiptRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    documentNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    warehouseId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    receiptDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    referenceNo: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(StockStatusEnum)
    status: StockStatusEnum;

    @ApiProperty()
    @IsNotEmpty()
    totalQuantity: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    attachments?: AttachmentDto[];
    
    @ApiHideProperty()
    createdById: string;

    @ApiProperty({
        type: () => [CreateStockReceiptItemRequestDto]
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayUnique((item: CreateStockReceiptItemRequestDto) => item?.productId, { message: 'Each product may only appear once in a receipt' })
    @Type(() => CreateStockReceiptItemRequestDto)
    @ValidateNested({ 
        each: true 
    })
    items: CreateStockReceiptItemRequestDto[];

}
