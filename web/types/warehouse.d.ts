export {};

declare global {
    interface IWarehouseResponse {
        id: string;
        code: string;
        nameEn: string;
        nameKh: string;
        managerId: string;
        manager: IUserResponse;
        address?: string;
        contactNumber?: string;
        logo?: Object;
        createdById?: string;
        createdby: IUserResponse;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }

    interface IWarehouse {
        code: string;
        nameEn: string;
        nameKh: string;
        managerId: string;
        address?: string;
        contactNumber?: string;
        logo?: Object;
    }
}