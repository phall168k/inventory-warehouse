import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}