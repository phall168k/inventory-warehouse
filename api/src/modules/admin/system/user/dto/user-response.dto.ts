import { AttachmentDto } from "@/common/dto/attachment.dto";
import { ApiProperty } from "@nestjs/swagger";
import { RoleResponseDto } from "../../role/dto/role-response.dto";

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    profile: AttachmentDto;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSuperUser: boolean;

    @ApiProperty()
    roles: RoleResponseDto[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}