export default defineNuxtRouteMiddleware((to) => {
    const requiredPermission = to.meta.permission;
    if (requiredPermission == null) return;

    const { user, permissions } = useAuth();
    const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const hasPermission = user.value?.isActive && (
        user.value.isSuperUser === true
        || required.some(permission => permissions.value.includes(permission))
    );

    if (!hasPermission) {
        return abortNavigation(createError({ statusCode: 403, statusMessage: 'Forbidden' }));
    }
});
