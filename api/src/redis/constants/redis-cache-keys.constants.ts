export const RedisCacheKeys = {
    USER: {
        DETAIL: (id: string) => `user:detail:${id}`,
        SELECT: 'user:select',
    }
}