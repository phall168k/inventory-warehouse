export const RedisCacheKeys = {
    USER: {
        DETAIL: (id: string) => `user:detail:${id}`,
        SELECT: 'user:select',
    },
    CATEGORY: {
        DETAIL: (id: string) => `category:detail:${id}`,
        SELECT: 'category:select',
    },
    UOM: {
        DETAIL: (id: string) => `uom:detail:${id}`,
        SELECT: 'uom:select',
    },
    PRODUCT: {
        DETAIL: (id: string) => `product:detail:${id}`,
        SELECT: 'product:select',
    },
    WAREHOUSE: {
        DETAIL: (id: string) => `warehouse:detail:${id}`,
    },
}