import { ApiProperty } from "@nestjs/swagger";

export class StockSelectOptionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;
}