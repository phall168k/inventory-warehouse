import { Can } from '@nestjs/authorization';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { CurrentUser, Public } from '@nestjs/authentication';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { UserResponseDto } from '../admin/system/user/dto/user-response.dto';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Authentication')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @Public()
    @ApiOperation({ summary: 'Sign in by username and password' })
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid username or password' })
    public signIn(@Body() dto: SignInRequestDto) {
        return this.authService.signIn(dto);
    }

    @Post('refresh')
    @Public()
    @ApiOperation({ summary: 'Refresh access and refresh token' })
    @ApiOkResponse({ type: RefreshTokenResponseDto })
    public refresh(@Body() dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        return this.authService.refreshToken(dto.refreshToken);
    }

    @Get('me')
    @Can.Anyone()
    @ApiBearerAuth(SWAGGER_TOKEN_NAME)
    @ApiOperation({ summary: 'Get user information' })
    @ApiOkResponse({ type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    public getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
        return user;
    }

}
