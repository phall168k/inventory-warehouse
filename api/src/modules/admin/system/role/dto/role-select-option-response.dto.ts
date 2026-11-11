import { ApiProperty } from "@nestjs/swagger";

export class RoleSelectOptionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;
}