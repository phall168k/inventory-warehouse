import { AttachmentDto } from "@/common/dto/attachment.dto";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateWarehouseRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    nameEn: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    nameKh: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    managerId: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(250)
    address?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MaxLength(250)
    contactNumber?: string;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    logo?: AttachmentDto;

    @ApiHideProperty()
    createdById: string;
}
