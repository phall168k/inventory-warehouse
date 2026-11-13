export {};

declare global {
    interface IRoleResponse {
        id: string;
        nameEn: string;
        nameKh: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        permissions: IPermissionResponse[];
    }

    interface IRole {
        nameEn: string;
        nameKh: string;
        permissions: string[];
    }
}