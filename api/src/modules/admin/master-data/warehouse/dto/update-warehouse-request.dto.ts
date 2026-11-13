import { PartialType } from '@nestjs/swagger';
import { CreateWarehouseRequestDto } from './create-warehouse-request.dto';

export class UpdateWarehouseRequestDto extends PartialType(CreateWarehouseRequestDto) {}
