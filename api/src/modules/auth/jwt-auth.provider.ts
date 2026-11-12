import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import { UserService } from "../admin/system/user/user.service";
import { isUUID } from "class-validator";
import { UserResponseDto } from "../admin/system/user/dto/user-response.dto";

@Injectable()
export class JwtAuthProvider extends JwtBearerProvider<UserResponseDto> {
    constructor(
        private readonly userService: UserService,
        registry: AuthenticationRegistry,
    ) {
        super({
            realm: 'stockpro'
        });

        registry.registerProvider(this);
    }

    async validate(claims: JwtClaims): Promise<UserResponseDto | null> {
        const userId = claims.sub;

        if (typeof userId !== 'string' || !isUUID(userId)) {
            return null;
        }

        const user = await this.userService.findOne(userId);

        if (!user || !user.isActive) {
            return null;
        }

        return user;
    }
}