export {};

declare global {
    interface IPermissionResponse {
        id: string;
        name: string;
    }

    interface IPermissionSelectOption extends IPermissionResponse {
        children?: IPermissionResponse[];
    }
}
