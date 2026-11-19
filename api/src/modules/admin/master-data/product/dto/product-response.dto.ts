import { AttachmentDto } from '@/common/dto/attachment.dto';
import { CategoryResponseDto } from '../../category/dto/category-response.dto';
import { UomResponseDto } from '../../uom/dto/uom-response.dto';
import { UserResponseDto } from '@/modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { StockResponseDto } from '@/modules/admin/inventory/stock/dto/stock-response.dto';

export class ProductResponseDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty({ type: CategoryResponseDto })
  category?: CategoryResponseDto;

  @ApiProperty({ format: 'uuid' })
  uomId: string;

  @ApiProperty({ type: UomResponseDto })
  uom?: UomResponseDto;

  @ApiProperty({ type: AttachmentDto, nullable: true })
  thumbnail: AttachmentDto | null;

  @ApiProperty()
  status: boolean;

  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  createdById: string;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({
    type: () => StockResponseDto,
    isArray: true,
  })
  stocks: StockResponseDto[];
}
