import { UserService } from '@/modules/admin/system/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { handleError } from '@/common/utils/handle-error.util';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { UserMapper } from '@/modules/admin/system/user/user.mapper';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenService: TokenService,
    ) {}

    public async signIn(dto: SignInRequestDto) {
        try {
            const user = await this.userService.findByUsername(dto.username);
            if (!user) throw new UnauthorizedException('Invalid username or password');
            const passwordValid = await this.passwordHasher.verify(
                dto.password,
                user.password,
            );

            if (!passwordValid) throw new UnauthorizedException('Invalid username or password');

            const token = await this.tokenService.issue(
                String(user.id),
                {
                    method: 'password',
                    claims: {
                        amr: ['pwd'],
                    },
                },
            );
            const userMapped = await UserMapper.toDtoWithRelationship(user);
            return {
                accessToken: token.accessToken,
                refresh: token.refreshToken,
                tokenType: 'Bearer',
                expiresIn: token.expiresIn,
                user: userMapped,
            };

        } catch (error) {
            handleError(error);
        }
    }

    public async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
        const token = await this.tokenService.refresh(refreshToken);

        return {
            ...token,
            tokenType: 'Bearer',
        };
    }
}
