import { ApiProperty } from "@nestjs/swagger";

export class UserSelectOptionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;
}