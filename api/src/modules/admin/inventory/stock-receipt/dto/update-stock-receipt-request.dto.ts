import { PartialType } from '@nestjs/swagger';
import { CreateStockReceiptRequestDto } from './create-stock-receipt-request.dto';

export class UpdateStockReceiptRequestDto extends PartialType(CreateStockReceiptRequestDto) {}
