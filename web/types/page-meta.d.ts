declare module '#app' {
    interface PageMeta {
        /** Any one of these permissions grants access. */
        permission?: string | string[];
    }
}

export {};
