export const usePermission = () => {
    const { user, permissions } = useAuth();

    const can = (permission: string | string[]): boolean => {
        if (!user.value?.isActive) return false;
        if (user.value.isSuperUser === true) return true;

        const required = Array.isArray(permission) ? permission : [permission];
        return required.some(p => permissions.value.includes(p));
    };

    const canAll = (required: string[]): boolean => {
        if (!user.value?.isActive) return false;
        if (user.value.isSuperUser === true) return true;

        return required.every(p => permissions.value.includes(p));
    };

    return {
        can,
        canAll,
    };
}
