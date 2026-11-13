export {};

declare global {
    interface IUserResponse {
        id: string;
        nameEn: string;
        nameKh: string;
        username: string;
        email: string;
        profile: Object;
        isActive: boolean;
        isSuperUser: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        roles: IRoleResponse[];
        warehouses: IWarehouseResponse[];
    }

    interface IUser {
        nameEn: string;
        nameKh: string;
        username: string;
        email: string;
        password: string;
        profile: Object;
        isActive: boolean;
        roles: string[];
        warehouses: string[];
    }
}