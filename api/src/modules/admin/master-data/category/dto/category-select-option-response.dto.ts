import { ApiProperty } from "@nestjs/swagger";

export class CategorySelectOptionDto {
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
}