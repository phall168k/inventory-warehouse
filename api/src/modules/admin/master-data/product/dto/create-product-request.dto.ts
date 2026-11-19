import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  IsUUID,
} from 'class-validator';
import { UpdateProductRequestDto } from './update-product-request.dto';

export class CreateProductDto extends UpdateProductRequestDto{
  @ApiProperty({
    type: [String],
    format: 'uuid',
    description: 'List of warehouse IDs assigned to the product',
    example: [
      'f85db93a-f850-4b6b-a1de-6e21c2511234',
      'c13d2732-12c5-40d0-a1a3-5dd45c82b451',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  declare warehouseIds: string[];

  @ApiPropertyOptional({ 
    minimum: 0, 
    default: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({
    minimum: 0, 
    default: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  receiveQuantity?: number;

  @ApiPropertyOptional({ 
    minimum: 0, 
    default: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  issueQuantity?: number;

  @ApiPropertyOptional({ 
    minimum: 0, 
    default: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transferQuantity?: number;

  @ApiPropertyOptional({ 
    minimum: 0, 
    default: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  adjustmentQuantity?: number;

  @ApiHideProperty()
  createdById: string;
}
