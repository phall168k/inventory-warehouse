import { PartialType } from "@nestjs/swagger";
import { CreateStockReceiptItemRequestDto } from "./create-stock-receipt-item-request.dto";

export class UpdateStockReceiptItemRequestDto extends PartialType(CreateStockReceiptItemRequestDto) {}