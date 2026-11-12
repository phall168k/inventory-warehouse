import { UserResponseDto } from "@/modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SignInResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    tokenType: string;

    @ApiProperty()
    expiresIn: number;

    @ApiProperty({
        type: () => UserResponseDto,
    })
    user: UserResponseDto;
}