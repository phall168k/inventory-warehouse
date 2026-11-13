export {};

declare global {
    interface IAuthResponse {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
        user: IUserResponse;
    }

    interface IRefreshTokenResponse {
        accessToken: string;
        refreshToken: string;
        tokenType: string;
        expiresIn: number;
    }
}