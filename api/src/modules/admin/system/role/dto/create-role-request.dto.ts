import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateRoleRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    nameEn: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    nameKh: string;

    @ApiProperty({
        type: [String],
        format: 'uuid',
        description: 'List of permission UUIDs assigned to the role',
        example: [
            '550e8400-e29b-41d4-a716-446655440000',
            '550e8400-e29b-41d4-a716-446655440001',
        ],
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    permissions: string[];

}
