import { ApiProperty } from "@nestjs/swagger";
import { PermissionResponseDto } from "../../permission/dto/permission-response.dto";

export class RoleResponseDto {
    @ApiProperty({
        type: String,
        format: 'uuid',
    })
    id: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    permissions: PermissionResponseDto[];


}