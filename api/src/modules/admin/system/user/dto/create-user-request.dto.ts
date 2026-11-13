import { AttachmentDto } from "@/common/dto/attachment.dto";
import { 
    ApiProperty, 
    ApiPropertyOptional 
} from "@nestjs/swagger";
import { 
    IsArray,
    IsUUID,
    ArrayUnique,
    IsBoolean, 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    MaxLength 
} from "class-validator";

export class CreateUserRequestDto {
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
    @IsString()
    @MaxLength(250)
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(250)
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    password: string;

    @ApiPropertyOptional()
    @IsOptional()
    profile?: AttachmentDto;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        type: [String],
    })
    @IsNotEmpty()
    @IsArray()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    roles: string[];

    @ApiPropertyOptional({ type: [String], description: 'Existing warehouse IDs assigned to the user' })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    warehouses?: string[];

}
