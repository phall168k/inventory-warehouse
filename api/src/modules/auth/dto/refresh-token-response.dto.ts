import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenResponseDto {
    @ApiProperty({
        description: 'JWT access token',
    })
    accessToken: string;

    @ApiProperty({
        description: 'Rotating refresh token',
    })
    refreshToken: string;

    @ApiProperty({
        example: 'Bearer',
    })
    tokenType: string;

    @ApiProperty({
        example: 900,
        description: 'Access token expiration in seconds',
    })
    expiresIn: number;
    
}