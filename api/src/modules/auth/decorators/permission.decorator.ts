import { Can } from "@nestjs/authorization";
import { PermissionPolicy } from "../permission.polocy";

export const Permissions = (...permissions: string[]) => {
    if (permissions.length === 0) {
        throw new Error('@Permissions() requires at least one permission');
    }

    return Can(
        PermissionPolicy,
        'any',
        () => [permissions],
    );
}