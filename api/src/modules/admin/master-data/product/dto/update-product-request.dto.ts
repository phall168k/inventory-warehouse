import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateIf, ValidateNested } from 'class-validator';
import { AttachmentDto } from '@/common/dto/attachment.dto';
import { Type } from 'class-transformer';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  warehouseIds?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  nameEn: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  nameKh: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  uomId: string;

  @ApiPropertyOptional({ default: true })
  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ type: AttachmentDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => AttachmentDto)
  thumbnail?: AttachmentDto | null;
}
