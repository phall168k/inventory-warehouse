import { Policy } from '@nestjs/authorization';
import type { UserResponseDto } from '../admin/system/user/dto/user-response.dto';

@Policy()
export class PermissionPolicy {
    any(user: UserResponseDto | null, permissions: string[]): boolean {
        if (!user?.isActive) return false;
        if (user.isSuperUser === true) return true;
        if (permissions.length === 0) return false;

        const granted = new Set(
            (user.roles ?? []).flatMap((role) =>
                (role.permissions ?? []).map((permission) => permission.name),
            ),
        );
        return permissions.some((permission) => granted.has(permission));
    }
}
