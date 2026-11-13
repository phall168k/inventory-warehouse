import { AttachmentDto } from "@/common/dto/attachment.dto";
import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class WarehouseResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    managerId: string;

    @ApiProperty()
    manager: UserResponseDto;

    @ApiProperty()
    address: string;

    @ApiProperty()
    contactNumber: string;

    @ApiProperty()
    logo: AttachmentDto;

    @ApiProperty()
    createdById: string;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}