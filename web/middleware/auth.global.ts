export default defineNuxtRouteMiddleware(async (to) => {
    const isSignInPage = to.path.replace(/\/+$/, '') === '/auth/sign-in';
    const { auth, refreshToken } = useAuth();

    let isAuthenticated = !!auth.value?.accessToken;

    if (!isAuthenticated && auth.value?.refreshToken) {
        isAuthenticated = !!(await refreshToken());
    }

    if (isSignInPage) {
        if (isAuthenticated) return navigateTo('/', { replace: true });
        return;
    }

    if (!isAuthenticated) {
        return navigateTo('/auth/sign-in', { replace: true });
    }
});
