import { ApiProperty } from "@nestjs/swagger";

export class WarehouseSelectOptionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;
}