import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UomResponseDto {
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
}