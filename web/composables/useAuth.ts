export const useAuth = () => {
    const config = useRuntimeConfig();

    const auth = useCookie<IAuthResponse | null>('auth', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: !import.meta.dev,
        path: '/',
    });

    const user = computed(() => auth.value?.user ?? null);

    const accessToken = computed(
        () => auth.value?.accessToken,
    );

    const isAuthenticated = computed(
        () => !!auth.value?.accessToken,
    );

    const permissions = computed(() => {
        return [
            ...new Set(
                user.value?.roles.flatMap((role) => 
                    role.permissions.map(p => p.name),
                ) ?? [],
            ),
        ];
    });
    
    const hashPermission = (permission: string): boolean => {
        if (user.value?.isSuperUser) return true;

        return permissions.value.includes(permission);
    }

    const clearAuth = () => {
        auth.value = null;
    }

    const signIn = async (credentials: ISignIn) => {
        const response = await useApi<IAuthResponse>('v1/auth/sign-in', {
            method: 'post',
            body: credentials,
        });

        auth.value = response.payload;

        return response.payload;
    }

    const refreshToken = async (): Promise<string | null> => {
        const current = auth.value;

        if (!current?.refreshToken) return null;

        try {
            const response = await useApi<IRefreshTokenResponse>('v1/auth/refresh', {
                method: 'post',
                body: {
                    refreshToken: current.refreshToken,
                },
            }, false);

            const payload = response.payload;

            auth.value = {
                ...current,
                 accessToken: payload.accessToken,
                refreshToken: payload.refreshToken ?? current.refreshToken,
                tokenType: payload.tokenType ?? current.tokenType,
                expiresIn: payload.expiresIn,
                user: current.user,
            };

            return payload.accessToken;
        } catch {
            clearAuth();
            return null;
        }
    }

    const logout = async () => {
        const refreshToken = auth.value?.refreshToken;

        try {
            if (refreshToken) {
                await useApi('v1/auth/sign-out', {
                    method: 'post',
                    body: {
                        refreshToken,
                    },
                });
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            clearAuth();
            await navigateTo('/auth/sign-in', {
                replace: true,
            });
        }
    }

    return {
        auth,
        user,
        accessToken,
        isAuthenticated,
        permissions,
        hashPermission,
        signIn,
        refreshToken,
        logout,
        clearAuth,
    };
}
