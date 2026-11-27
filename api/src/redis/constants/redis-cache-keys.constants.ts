export const RedisCacheKeys = {
    USER: {
        DETAIL: (id: string) => `user:detail:${id}`,
        SELECT: 'user:select',
    },
    CATEGORY: {
        DETAIL: (id: string) => `category:detail:${id}`,
        SELECT: 'category:select',
    },
}