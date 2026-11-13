export {};

declare global {
    interface IResponse<T> {
        payload: T;
        timestamp: number;
    }
}