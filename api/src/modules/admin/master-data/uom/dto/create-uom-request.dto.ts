import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUomRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    code: string;

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

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;

    @ApiHideProperty()
    createdById: string;
}
