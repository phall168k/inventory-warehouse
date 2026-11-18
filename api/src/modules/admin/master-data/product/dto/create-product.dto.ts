import { AttachmentDto } from '@/common/dto/attachment.dto';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
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

  @ApiHideProperty()
  createdById: string;
}
